import json
from typing import List, Union
from pydantic import BaseModel, Field
from datetime import UTC
import concurrent.futures
from .interpolate import interpolate_values
from .external_apis.bm.bm import MelsStreamRequest, PnStreamRequest, BoalfStreamRequest
from .external_apis.eso_embedded import EsoEmbedded
from .external_apis.bm.units import UNITGROUP_FUELTYPE
from . import types as t
from .logs import logging
from .sentry import init_sentry
from datetime import datetime, timedelta

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1"


def next_minute() -> datetime:
    """Return the next minute from the current time."""
    now = datetime.now().replace(second=0, microsecond=0, tzinfo=UTC)
    return now + timedelta(minutes=1)


def current_settlement_period() -> t.FromToParams:
    """Return the current settlement period."""
    now = datetime.now().replace(second=0, microsecond=0, tzinfo=UTC)
    if now.minute >= 30:
        from_dt = now.replace(minute=30)
    else:
        from_dt = now.replace(minute=0)
    to_dt = now
    return t.FromToParams(from_dt=from_dt, to_dt=to_dt)


def get_bm_units(
    records: List[Union[t.RawBoalfRecord, t.RawMelsRecord, t.RawPnRecord]]
) -> List[str]:
    """Extract unique BM units from the raw records."""
    units = {x.bmUnit for x in records if x.bmUnit}
    logging.debug(f"Identified {len(units)} unique BM units")
    return list(units)


class GbPointInTimeRequest(BaseModel):
    """Request to retrieve the GB snapshot at a given datetime."""

    dt: datetime = Field(default_factory=next_minute, description="The target datetime")
    from_to: t.FromToParams = Field(default_factory=current_settlement_period)

    def run(self) -> t.GbPointInTime:
        """Retrieve and combine MELS, PN, and BOALF data in parallel."""
        started = datetime.now()
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # log out how many threads are being used
            # logging.info(f"Using {executor._max_workers} threads")

            future_mels = executor.submit(MelsStreamRequest(from_to=self.from_to).run)
            future_pn = executor.submit(PnStreamRequest(from_to=self.from_to).run)
            future_boalf = executor.submit(BoalfStreamRequest(from_to=self.from_to).run)
            future_embedded = executor.submit(EsoEmbedded(dt=self.dt).run)

            mels = future_mels.result()
            pn = future_pn.result()
            boalf = future_boalf.result()
            embedded = future_embedded.result()

        logging.info(f"Completed external_api requests in {datetime.now() - started}")

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_output = executor.submit(self._combine, mels, pn, boalf)
            future_interpolate = executor.submit(
                self._interpolate, future_output.result()
            )
            future_unit_groups = executor.submit(
                self._group_by_unitgroup, future_interpolate.result()
            )
            future_bm_fuel_types = executor.submit(
                self._group_by_fueltype, future_unit_groups.result()
            )
            future_fuel_types = executor.submit(
                self._combine_fuel_types, future_bm_fuel_types.result(), embedded
            )
            future_interconnectors = executor.submit(
                self._group_by_interconnector, future_interpolate.result()
            )
            future_foreign_markets = executor.submit(
                self._group_by_foreign_market, future_interconnectors.result()
            )
            future_balancing_totals = executor.submit(
                self._calculate_balancing_totals, boalf
            )
            
            output = t.GbPointInTime(
                dt=self.dt,
                unit_groups=future_unit_groups.result().values(),
                fuel_types=future_fuel_types.result(),
                foreign_markets=future_foreign_markets.result(),
                balancing_totals=future_balancing_totals.result(),
            )

        return output

    def _combine(
        self,
        mels: List[t.RawMelsRecord],
        pn: List[t.RawPnRecord],
        boalf: List[t.RawBoalfRecord],
    ) -> t.CombinedOutput:
        """Combine MELS, PN, and BOALF data into a single output."""
        output = {}
        bm_units = get_bm_units(mels + pn + boalf)
        for bm_unit in bm_units:

            filtered_pn = [x for x in pn if x.bmUnit and x.bmUnit == bm_unit]
            filtered_mels = [x for x in mels if x.bmUnit and x.bmUnit == bm_unit]
            filtered_boalf = [x for x in boalf if x.bmUnit and x.bmUnit == bm_unit]

            # if len(filtered_boalf) > 0:
            #     print(f"Found {len(filtered_boalf)} balancing records for {bm_unit}")

            output[bm_unit] = t.UnitRecords(
                pn=self._to_level_pairs(filtered_pn),
                mels=self._to_level_pairs(filtered_mels),
                boalf=self._to_level_pairs(filtered_boalf),
            )
        return output

    def _to_level_pairs(
        self, records: Union[t.RawMelsRecord, t.RawPnRecord, t.RawBoalfRecord]
    ) -> List[t.LevelPair]:
        """Convert a list of records to a list of level pairs."""
        output_dict = {}
        for record in records:
            output_dict[record.timeFrom] = record.levelFrom
            output_dict[record.timeTo] = record.levelTo
        pairs = [t.LevelPair(d=d, x=x) for d, x in output_dict.items()]
        # sort by d
        pairs.sort(key=lambda x: x.d)
        return pairs

    def _interpolate(self, combined) -> t.UnitsPointInTime:
        """Calculate the expected output for each unit at the target datetime in parallel."""
        started = datetime.now()
        from .interpolate import planned_output

        # Set up the ThreadPoolExecutor to process each unit in parallel
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Submit each planned_output task for parallel execution
            future_interpolations = {
                executor.submit(planned_output, v, self.dt, k): k
                for k, v in combined.items()
            }

            # Gather the results as they complete
            output = {}
            for future in concurrent.futures.as_completed(future_interpolations):
                unit_key = future_interpolations[future]
                try:
                    output[unit_key] = future.result()
                except Exception as e:
                    logging.error(f"Interpolation failed for {unit_key}: {e}")

        logging.info(f"Completed interpolation in {datetime.now() - started}")
        return output

    def _group_by_unitgroup(
        self, unit_outputs: t.UnitsPointInTime
    ) -> t.UnitGroupsPointInTime:
        """Group the output by unit group."""
        started = datetime.now()

        from .external_apis.bm.units import UNIT_GROUPS, UNIT_UNITGROUP

        group_outputs = {
            k.details.code: t.UnitGroupPointInTime(
                code=k.details.code,
                name=k.details.name,
                coords={
                    "lat": k.details.coords.lat,
                    "lng": k.details.coords.lng,
                },
                output={"level": 0, "delta": 0},
                capacity=0,
                balancing_volume=0,
            )
            for k in UNIT_GROUPS
        }

        for unit, output in unit_outputs.items():

            if not unit in group_outputs.keys():
                continue

            group = UNIT_UNITGROUP[unit]

            group_outputs[group].output.level += output.output.level
            group_outputs[group].output.delta += output.output.delta
            group_outputs[group].capacity += output.capacity

            group_outputs[group].balancing_volume += output.balancing_volume

        logging.info(f"Completed grouping by unit group in {datetime.now() - started}")

        return group_outputs

    def _group_by_fueltype(
        self, unit_groups: t.UnitGroupsPointInTime
    ) -> t.FuelTypesPointInTime:
        """group the output by fuel type"""

        fuel_type_outputs = {
            K: t.FuelTypePointInTime(
                code=K,
                output={"level": 0, "delta": 0},
                capacity=0,
                balancing_totals={"bids": 0, "offers": 0},
            )
            for K in UNITGROUP_FUELTYPE.values()
        }

        for unit_group, fuel_type in UNITGROUP_FUELTYPE.items():

            if unit_group in unit_groups.keys():

                output = unit_groups[unit_group]

                fuel_type_outputs[fuel_type].output.level += output.output.level
                fuel_type_outputs[fuel_type].output.delta += output.output.delta
                fuel_type_outputs[fuel_type].capacity += output.capacity

                balancing_volume = output.balancing_volume
                if balancing_volume > 0:
                    fuel_type_outputs[fuel_type].balancing_totals.offers += balancing_volume
                else:
                    fuel_type_outputs[fuel_type].balancing_totals.bids += balancing_volume

            else:
                print(f"no output for {unit_group}")
                pass

        return fuel_type_outputs

    def _combine_fuel_types(self, bm_fuel_types: t.UnitGroupsPointInTime, embedded: t.EmbeddedSnapshot) -> List[t.FuelTypePointInTime]:
        """add the embedded generation to the bm fuel types"""
        if not "solar" in bm_fuel_types:
            bm_fuel_types["solar"] = t.UnitPointInTime(
                output={"level": 0, "delta": 0}, capacity=0, balancing_volume=0
            )
        if not "wind" in bm_fuel_types:
            bm_fuel_types["wind"] = t.UnitPointInTime(
                output={"level": 0, "delta": 0}, capacity=0, balancing_volume=0
            )

        bm_fuel_types["solar"].output.level += embedded.solar.generation.level
        bm_fuel_types["solar"].output.delta += embedded.solar.generation.delta
        bm_fuel_types["solar"].capacity += embedded.solar.capacity

        bm_fuel_types["wind"].output.level += embedded.wind.generation.level
        bm_fuel_types["wind"].output.delta += embedded.wind.generation.delta
        bm_fuel_types["wind"].capacity += embedded.wind.capacity

        return  bm_fuel_types.values()

    def _group_by_interconnector(
        self, unit_outputs: t.UnitsPointInTime
    ) -> t.InterconnectorPointInTime:
        """Group the output by interconnector"""

        from .external_apis.bm.interconnectors import (
            get_interconnector_code,
            INTERCONNECTORS,
        )

        interconnector_outputs = {
            k: t.InterconnectorPointInTime(
                output={"level": 0, "delta": 0},
                capacity=i.capacity, 
                code=k, 
                balancing_volume=0, 
                coords=i.coords.model_dump()
            )
            for k, i in INTERCONNECTORS.items()
        }

        for unit, output in unit_outputs.items():
            interconnector = get_interconnector_code(unit)
            if interconnector:
                interconnector_outputs[
                    interconnector
                ].output.level += output.output.level
                interconnector_outputs[
                    interconnector
                ].output.delta += output.output.delta
                interconnector_outputs[interconnector].capacity += output.capacity
                interconnector_outputs[interconnector].balancing_volume += output.balancing_volume
                
        return interconnector_outputs

    def _group_by_foreign_market(
        self, interconnector_outputs: t.InterconnectorPointInTime
    ) -> List[t.ForeignMarketPointInTime]:
        """Group the output by foreign market"""
        from .external_apis.bm.interconnectors import FOREIGN_MARKETS

        outputs: List[t.ForeignMarketPointInTime] = []
        for fm in FOREIGN_MARKETS:
            interconnector_codes = [i.code4 for i in fm.interconnectors]

            output = t.ForeignMarketPointInTime(
                code=fm.key.value,
                output=t.UnitOutput(level=0, delta=0),
                capacity=0,
                coords=t.Coords(lat=fm.coords.lat, lng=fm.coords.lng),
                interconnectors=[],
                balancing_volume=0,
            )

            for code, interconnector in interconnector_outputs.items():
                if code in interconnector_codes:

                    output.interconnectors.append(interconnector)

                    output.output.level += interconnector.output.level
                    output.output.delta += interconnector.output.delta
                    output.capacity += interconnector.capacity

                    output.balancing_volume += interconnector.balancing_volume

            outputs.append(output)

        return outputs

    def _calculate_balancing_totals(self, boalfs: List[t.RawBoalfRecord]):
        bids = 0
        offers = 0
        unit_boalfs = {}

        for boalf in boalfs:
            if not boalf.bmUnit in unit_boalfs:
                unit_boalfs[boalf.bmUnit] = []
            unit_boalfs[boalf.bmUnit].append(boalf)

        for boalfs in unit_boalfs.values():
            values = {}
            for boalf in boalfs:
                values[boalf.timeFrom] = boalf.levelFrom
                values[boalf.timeTo] = boalf.levelTo
            level_pairs = [t.LevelPair(d=d, x=x) for d, x in values.items()]
            output = interpolate_values(level_pairs, self.dt)
            if not output:
                continue

            bids += output.level if output.level < 0 else 0
            offers += output.level if output.level > 0 else 0
            
        return t.BalancingTotals(bids=bids, offers=offers).model_dump()

def handler(event=None, context=None):
    # init_sentry()
    return {
        "statusCode": 200,
        "body": GbPointInTimeRequest().run().model_dump_json(),
        "headers": {"Content-Type": "application/json"},
    }


if __name__ == "__main__":
    x = handler()
    content = json.loads(x["body"])
    with open("data/example.json", "w") as f:
        json.dump(content, f, indent=4)
