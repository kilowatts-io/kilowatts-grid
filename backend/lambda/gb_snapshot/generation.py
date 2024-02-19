import logging
from typing import List
from pydantic import BaseModel
from .bm.generation import UNIT_UNITGROUP, UNITGROUP_FUELTYPE, UNITGROUP_COORDS
import pandas as pd
from .ptypes import EmbeddedSnapshot, TotalsSnapshot, UnitGroupSnapshot


class GenerationTotals(BaseModel):
    bm: pd.DataFrame
    embedded: EmbeddedSnapshot
    model_config = {"arbitrary_types_allowed": True}

    def run(self):
        unit_groups = self._get_unit_groups()
        bm_fuel_types = self._get_fuel_types(unit_groups.copy())
        fuel_types = self._add_embedded(bm_fuel_types.copy())
        return self._serialize_unit_groups(unit_groups), self._serialize_fuel_types(
            fuel_types
        )

    def _get_unit_groups(self):
        known = self.bm.copy()[self.bm.index.isin(UNIT_UNITGROUP.index)]
        known["unit_group"] = UNIT_UNITGROUP[known.index]
        return known.groupby("unit_group").sum()

    def _get_fuel_types(self, unit_groups: pd.DataFrame):
        unit_groups["fuel_type"] = UNITGROUP_FUELTYPE[unit_groups.index]
        return unit_groups.groupby("fuel_type").sum()

    def _add_embedded(self, bm_fuel_types: pd.DataFrame):
        for attr in ["solar", "wind"]:
            if getattr(self.embedded, attr).generation > 0:
                if attr in bm_fuel_types.index:
                    bm_fuel_types.loc[attr, "ac"] += getattr(
                        self.embedded, attr
                    ).generation
                    bm_fuel_types.loc[attr, "cp"] += getattr(
                        self.embedded, attr
                    ).capacity
                else:
                    bm_fuel_types.loc[attr] = {
                        "ac": getattr(self.embedded, attr).generation,
                        "cp": getattr(self.embedded, attr).capacity,
                    }
        return bm_fuel_types

    def _serialize_unit_groups(self, df: pd.DataFrame) -> List[UnitGroupSnapshot]:
        df = df.copy().round(1).sort_values(["ac", "cp"], ascending=False)
        count = df.shape[0]
        df = df[~(df[["ac", "bids", "offers"]] == 0).all(axis=1)]
        logging.info(
            f"filtered {count - df.shape[0]} unit groups with no generation - leaving {df.shape[0]} unit groups."
        )
        return [
            UnitGroupSnapshot(
                name=unit_group,
                key=unit_group,
                fuel_type=UNITGROUP_FUELTYPE[unit_group],
                coords=self._get_coords(unit_group),
                **row.to_dict(),
            )
            for unit_group, row in df.iterrows()
        ]

    def _get_coords(self, code: str):
        row = UNITGROUP_COORDS.loc[code]
        return {"lat": round(row[0], 1), "lng": round(row[1], 1)}

    def _serialize_fuel_types(self, df: pd.DataFrame) -> List[TotalsSnapshot]:
        return [
            TotalsSnapshot(name=fuel_type, key=fuel_type, **row)
            for fuel_type, row in df.round(1).iterrows()
        ]
