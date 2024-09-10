from enum import Enum
import json
from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Dict, List, Optional


class RequestParams(BaseModel):
    dt: datetime


class GbGridSnapshot(BaseModel):
    pass


class BmSnapshot(BaseModel):
    pass


class BalancingTotals(BaseModel):
    bids: float = Field(description="total live bids in MW")
    offers: float = Field(description="total live offers in MW")

    def model_dump_json(self):
        return json.dumps(
            {"bids": round(self.bids, 1), "offers": round(self.offers, 1)}
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


class FuelType(str, Enum):
    gas = "gas"
    wind = "wind"
    hydro = "hydro"
    biomass = "biomass"
    oil = "oil"
    solar = "solar"
    battery = "battery"


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


class UnitGroupSnapshot(Snapshot):
    name: str
    code: str = Field(description="code")
    fuel_type: FuelType
    coords: Coords


class UnitGroupDetails(BaseModel):
    code: str
    name: str
    coords: Coords
    fuel_type: str


class UnitGroupUnit(BaseModel):
    unit: str


class UnitGroup(BaseModel):
    details: UnitGroupDetails
    units: List[UnitGroupUnit]


class SheffieldGspSnapshot(UnitGroupSnapshot):
    pass


class NationalGridGspSnapshot(UnitGroupSnapshot):
    pass


class TotalsSnapshot(Snapshot):
    name: str
    code: FuelType


class InterconnectorSnapshot(Snapshot):
    code: str
    coords: Coords


class ForeignMarketKey(Enum):
    fr = "fr"
    nl = "nl"
    be = "be"
    ie = "ie"
    no = "no"
    dk = "dk"


class Interconnector(BaseModel):
    code4: str
    code2: str | List[str]
    name: str
    coords: Coords

    capacity: float

    model_config = {"arbitrary_types_allowed": True}


class ForeignMarket(BaseModel):
    key: ForeignMarketKey
    coords: Coords
    interconnectors: List[Interconnector]


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


# ESO Embedded


class EsoRawEmbeddedResponseRecord(BaseModel):
    # _id: int
    DATE_GMT: str
    TIME_GMT: str
    # SETTLEMENT_DATE: str
    # SETTLEMENT_PERIOD: int
    EMBEDDED_WIND_FORECAST: int
    EMBEDDED_WIND_CAPACITY: int
    EMBEDDED_SOLAR_FORECAST: int
    EMBEDDED_SOLAR_CAPACITY: int


class EsoRawEmbeddedResult(BaseModel):
    records: List[EsoRawEmbeddedResponseRecord]


class EsoRawEmbeddedResponse(BaseModel):
    result: EsoRawEmbeddedResult


class Coords(BaseModel):
    lat: float
    lng: float

    @field_validator("lat")
    def round_lat(cls, v):
        return round(v, 4)

    @field_validator("lng")
    def round_lng(cls, v):
        return round(v, 4)


# Elexon Insights Specific


class ElexonSettlementPeriodParams(BaseModel):
    settlementDate: date
    settlementPeriod: int = Field(..., ge=1, le=50)


class FromToParams(BaseModel):
    from_dt: datetime
    to_dt: datetime

    def model_dump(self):
        return {"from": self.from_dt.isoformat(), "to": self.to_dt.isoformat()}


class RawBoalfRecord(BaseModel):
    timeFrom: datetime
    timeTo: datetime
    levelFrom: float
    levelTo: float
    acceptanceNumber: int
    acceptanceTime: datetime
    bmUnit: Optional[str] = None
    deemedBoFlag: bool
    soFlag: bool
    amendmentFlag: str
    storFlag: bool
    rrFlag: bool


class RawBoalfResponse(BaseModel):
    data: List[RawBoalfRecord]


class Boalf(BaseModel):
    acceptanceNumber: int
    acceptanceTime: datetime
    deemedBoFlag: bool
    soFlag: bool
    amendmentFlag: str
    storFlag: bool
    rrFlag: bool
    # levels: pd.Series
    model_config = {"arbitrary_types_allowed": True}


class RawMelsRecord(BaseModel):
    timeFrom: datetime
    timeTo: datetime
    levelFrom: float
    levelTo: float
    notificationTime: datetime
    bmUnit: Optional[str] = None


class RawMelsResponse(BaseModel):
    data: List[RawMelsRecord]


class RawPnRecord(BaseModel):
    dataset: str = Field(...)
    settlementDate: date
    settlementPeriod: int = Field(..., ge=1, le=50)
    timeFrom: datetime
    timeTo: datetime
    levelFrom: float
    levelTo: float
    nationalGridBmUnit: Optional[str] = None
    bmUnit: Optional[str] = None


RawPnResponse = List[RawPnRecord]


class LevelPair(BaseModel):
    d: datetime
    x: float


class UnitOutput(BaseModel):
    level: float = Field(..., description="output in MW")
    delta: float = Field(..., description="delta in MW/minute")

    @field_validator("level")
    def round_int(cls, v):
        return int(v)

    @field_validator("delta")
    def round_1dp(cls, v):
        return round(v, 1)


class UnitPointInTime(BaseModel):
    output: UnitOutput
    balancing_volume: float
    capacity: float

    @field_validator("capacity")
    def round_int(cls, v):
        return int(v)


class UnitGroupPointInTime(UnitPointInTime):
    name: str
    code: str
    coords: Coords
    fuel_type: str


class InterconnectorPointInTime(UnitPointInTime, BaseModel):
    code: str
    coords: Coords


class ForeignMarketPointInTime(BaseModel):
    code: str
    output: UnitOutput
    capacity: float
    interconnectors: List[InterconnectorPointInTime]
    coords: Coords
    balancing_volume: float


class UnitRecords(BaseModel):
    mels: List[LevelPair]
    pn: List[LevelPair]
    boalf: List[LevelPair]


class EmbeddedGeneration(BaseModel):
    capacity: float
    generation: UnitOutput


class EmbeddedSnapshot(BaseModel):
    wind: EmbeddedGeneration
    solar: EmbeddedGeneration


class EmbeddedForecastValue(BaseModel):
    dt: datetime
    solar_capacity: float
    solar_generation: float
    wind_capacity: float
    wind_generation: float


class EsoEmbeddedForecast(BaseModel):
    obtained: datetime
    values: List[EmbeddedForecastValue] = Field(description="forecast values", min_length=10)


class BalancingTotals(BaseModel):
    bids: float = Field(description="total live bids in MW")
    offers: float = Field(description="total live offers in MW")

    def model_dump_json(self):
        return json.dumps(
            {"bids": round(self.bids, 1), "offers": round(self.offers, 1)}
        )

class FuelTypePointInTime(BaseModel):
    code: str
    output: UnitOutput
    capacity: float
    balancing_totals: BalancingTotals


CombinedOutput = Dict[str, UnitRecords]
DatetimeValueOutputDict = Dict[datetime, float]
CombinedBmData = DatetimeValueOutputDict
SerialisedUnit = Dict[str, UnitRecords]
UnitsPointInTime = Dict[str, UnitPointInTime]
UnitGroupsPointInTime = Dict[str, UnitGroupPointInTime]
FuelTypesPointInTime = Dict[str, FuelTypePointInTime]

class SerialisedOutput(BaseModel):
    from_to: FromToParams
    units: SerialisedUnit


class GbPointInTime(BaseModel):
    dt: datetime = Field(description="datetime for the snapshot")
    unit_groups: List[UnitGroupPointInTime] = Field(description="unit groups")
    fuel_types: List[FuelTypePointInTime] = Field(description="fuel types")
    foreign_markets: List[ForeignMarketPointInTime] 
    balancing_totals: BalancingTotals = Field(description="balancing totals for the entire grid")
