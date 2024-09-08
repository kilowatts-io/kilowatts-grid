from typing import List, Dict, Any
from pydantic import BaseModel
from gb_snapshot.external_apis.bm.units import (
    UNIT_UNITGROUP,
    UNITGROUP_FUELTYPE,
    UNITGROUP_NAMES,
    UNITGROUP_COORDS,
)

from ...types import EmbeddedSnapshot, TotalsSnapshot, UnitGroupSnapshot, CombinedBmData
from ...logs import logging
from datetime import datetime


class GenerationTotals(BaseModel):
    bm: CombinedBmData
    embedded: EmbeddedSnapshot

    def run(self):
        started = datetime.now()
        unit_groups = self._get_unit_groups()

        bm_fuel_types = self._get_fuel_types(unit_groups.copy())
        fuel_types = self._add_embedded(bm_fuel_types.copy())
        result = self._serialize_unit_groups(unit_groups), self._serialize_fuel_types(
            fuel_types
        )
        logging.info(f"generation_totals complete in {datetime.now() - started}")
        return result

    def _get_unit_groups(self) -> Dict[str, Dict[str, Any]]:
        known = [row for row in self.bm.data if row["index"] in UNIT_UNITGROUP]
        unit_group_sums = {}
        for row in known:
            unit_group = UNIT_UNITGROUP[row["index"]]
            if unit_group not in unit_group_sums:
                unit_group_sums[unit_group] = {
                    key: 0 for key in row.keys() if key != "index"
                }
            for key, value in row.items():
                if key != "index":
                    unit_group_sums[unit_group][key] += value
        return unit_group_sums

    def _get_fuel_types(
        self, unit_groups: Dict[str, Dict[str, Any]]
    ) -> Dict[str, Dict[str, Any]]:
        fuel_type_sums = {}
        for unit_group, data in unit_groups.items():
            fuel_type = UNITGROUP_FUELTYPE[unit_group]
            if fuel_type not in fuel_type_sums:
                fuel_type_sums[fuel_type] = {key: 0 for key in data.keys()}
            for key, value in data.items():
                fuel_type_sums[fuel_type][key] += value
        return fuel_type_sums

    def _add_embedded(
        self, bm_fuel_types: Dict[str, Dict[str, Any]]
    ) -> Dict[str, Dict[str, Any]]:
        for attr in ["solar", "wind"]:
            emb = getattr(self.embedded, attr)
            if attr in bm_fuel_types:
                bm_fuel_types[attr]["ac"] += emb.generation.level
                bm_fuel_types[attr]["dl"] += emb.generation.delta
                bm_fuel_types[attr]["cp"] += emb.capacity
            else:
                bm_fuel_types[attr] = {
                    "ac": emb.generation.level,
                    "dl": emb.generation.delta,
                    "cp": emb.capacity,
                }
        return bm_fuel_types

    def _serialize_unit_groups(
        self, unit_groups: Dict[str, Dict[str, Any]]
    ) -> List[UnitGroupSnapshot]:
        # Round the values and sort by "ac" and "cp" in descending order
        sorted_unit_groups = sorted(
            unit_groups.items(),
            key=lambda item: (item[1].get("ac", 0), item[1].get("cp", 0)),
            reverse=True,
        )
        # Filter out groups with no generation
        filtered_unit_groups = {
            code: data
            for code, data in sorted_unit_groups
            if not all(data.get(key, 0) == 0 for key in ["ac", "bids", "offers"])
        }
        # Serialize to UnitGroupSnapshot
        return [
            UnitGroupSnapshot(
                name=UNITGROUP_NAMES[unit_group],
                code=unit_group,
                fuel_type=UNITGROUP_FUELTYPE[unit_group],
                coords=self._get_coords(unit_group),
                **data,
            )
            for unit_group, data in filtered_unit_groups.items()
        ]

    def _get_coords(self, code: str) -> Dict[str, float]:
        lat, lng = UNITGROUP_COORDS[code]
        return {"lat": round(lat, 1), "lng": round(lng, 1)}

    def _serialize_fuel_types(
        self, fuel_types: Dict[str, Dict[str, Any]]
    ) -> List[TotalsSnapshot]:
        # Round the values in fuel_types
        for data in fuel_types.values():
            for key, value in data.items():
                if isinstance(value, (float, int)):
                    data[key] = round(value, 1)

        return [
            TotalsSnapshot(name=fuel_type, code=fuel_type, **data)
            for fuel_type, data in fuel_types.items()
        ]
