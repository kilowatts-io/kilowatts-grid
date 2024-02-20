from enum import Enum
import json
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List
from .bm.generation import Coords, FuelType
from .bm.interconnector import ForeignMarketKey
from .interpolate.ptypes import InterpolatedValue


class RequestParams(BaseModel):
    dt: datetime


class GbGridSnapshot(BaseModel):
    pass


class EmbeddedGeneration(BaseModel):
    capacity: float
    generation: InterpolatedValue


class EmbeddedSnapshot(BaseModel):
    wind: EmbeddedGeneration
    solar: EmbeddedGeneration


class BmSnapshot(BaseModel):
    pass


class BalancingTotals(BaseModel):
    bids: float = Field(description="total live bids in MW")
    offers: float = Field(description="total live offers in MW")

    def model_dump_json(self):
        return json.dumps(
            {"bids": round(self.bids, 1), "offers": round(self.offers, 1)}
        )


class Snapshot(BalancingTotals):
    cp: float = Field(description="actual output in MW")
    ac: float = Field(description="capacity in MW")
    dl: float = Field(description="delta in MW/minute")

    def model_dump_json(self):
        return json.dumps(
            {
                "bids": round(self.bids, 1),
                "offers": round(self.offers, 1),
                "cp": round(self.cp, 1),
                "ac": round(self.ac, 1),
            }
        )


class Coords(BaseModel):
    lat: float
    lng: float


class FuelType(str, Enum):
    gas = "gas"
    coal = "coal"
    wind = "wind"
    hydro = "hydro"
    nuclear = "nuclear"
    biomass = "biomass"
    oil = "oil"
    solar = "solar"
    battery = "battery"
    interconnector = "interconnector"


# this is the type rendered by the map or the list


class UnitGroupSnapshot(Snapshot):
    name: str
    code: str = Field(description="code")
    fuel_type: FuelType
    coords: Coords


class TotalsSnapshot(Snapshot):
    name: str
    code: FuelType


class InterconnectorSnapshot(Snapshot):
    code: str
    coords: Coords


class ForeignMarketSnapshot(BaseModel):
    code: ForeignMarketKey
    coords: Coords
    interconnectors: List[InterconnectorSnapshot]


class SummaryOutput(BaseModel):
    dt: datetime
    totals: List[TotalsSnapshot]
    generators: List[UnitGroupSnapshot]
    foreign_markets: List[ForeignMarketSnapshot]
    balancing_totals: BalancingTotals
