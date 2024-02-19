from enum import Enum
import pandas as pd
from pydantic import BaseModel, Field
from typing import Dict, Union, List


class ForeignMarketKey(Enum):
    fr = "fr"
    nl = "nl"
    be = "be"
    ie = "ie"
    no = "no"
    dk = "dk"


class Coords(BaseModel):
    lat: float
    lng: float


class Interconnector(BaseModel):
    code4: str
    code2: Union[str | List[str]]
    name: str
    coords: Coords
    capacity: float


class ForeignMarket(BaseModel):
    key: ForeignMarketKey
    coords: Coords
    interconnectors: List[Interconnector]


# Interconnectors

brtn = Interconnector(
    code4="BRTN",
    code2=["IB"],
    name="Britned",
    coords=Coords(lat=51.44298, lng=0.70782),
    market="nl",
    capacity=1000,
)

ifa2 = Interconnector(
    code4="IFA2",
    code2=["I2"],
    name="IFA2",
    coords=Coords(lat=50.81031, lng=-1.193889),
    market="fr",
    capacity=1000,
)

nemo = Interconnector(
    code4="NEMO",
    code2=["IN"],
    name="Nemo",
    coords=Coords(lat=51.3113, lng=1.3456),
    market="be",
    capacity=1000,
)

ewic = Interconnector(
    code4="EWIC",
    code2=["IE", "II"],
    name="Republic of Ireland",
    coords=Coords(lat=53.227222, lng=-3.072778),
    market="ie",
    capacity=500,
)

moyl = Interconnector(
    code4="MOYL",
    code2=["IM"],
    name="Moyle",
    coords=Coords(lat=54.65, lng=-4.9),
    market="ie",
    capacity=500,
)

vikl = Interconnector(
    code4="VKL",
    code2=["IV"],
    name="Viking",
    coords=Coords(lat=53.35, lng=0.2),
    market="dk",
    capacity=1400,
)

nsl = Interconnector(
    code4="NSL1",
    code2=["IS"],
    name="NSL",
    coords=Coords(lat=55.145, lng=-1.521),
    market="no",
    capacity=1400,
)

ifa1 = Interconnector(
    code4="IFA1",
    code2=["IF"],
    name="IFA",
    coords=Coords(lat=51.104, lng=1.35),
    market="fr",
    capacity=2000,
)

elec = Interconnector(
    code4="ELEC",
    code2=["IL"],
    name="Eleclink",
    coords=Coords(lat=51, lng=1),
    market="fr",
    capacity=1000,
)

# foreign markets
fr = ForeignMarket(
    key=ForeignMarketKey.fr,
    coords=Coords(lat=50, lng=2.5),
    interconnectors=[elec, ifa1, ifa2],
)

be = ForeignMarket(
    key=ForeignMarketKey.be, coords=Coords(lat=50.85, lng=3), interconnectors=[nemo]
)

nl = ForeignMarket(
    key=ForeignMarketKey.nl, coords=Coords(lat=51.5, lng=3), interconnectors=[brtn]
)

dk = ForeignMarket(
    key=ForeignMarketKey.dk, coords=Coords(lat=54.5, lng=1.5), interconnectors=[vikl]
)

no = ForeignMarket(
    key=ForeignMarketKey.no, coords=Coords(lat=55.6, lng=0.5), interconnectors=[nsl]
)

ie = ForeignMarket(
    key=ForeignMarketKey.ie,
    coords=Coords(lat=53.7, lng=-5),
    interconnectors=[ewic, moyl],
)

foreign_markets = [fr, be, nl, dk, no, ie]

total_interconnector_capacity = sum(
    [sum([i.capacity for i in m.interconnectors]) for m in foreign_markets]
)

# queries and lookups
def is_interconnector(full_code:str):
    return full_code[:2] == "I_"

def extract_code_4(full_code: str) -> str:
    return full_code.split("-")[1][:4]

def extract_code_2(full_code: str) -> str:
    return full_code.split("_")[1][:2]

def get_interconnector(bmunit_code: str) -> Union[Interconnector, None]:
    if not is_interconnector(bmunit_code):
        return None
    code2 = extract_code_2(bmunit_code)
    code4 = extract_code_4(bmunit_code)
    for market in foreign_markets:
        for interconnector in market.interconnectors:
            if code2 in interconnector.code2:
                return interconnector
            elif code4 == interconnector.code4:
                return interconnector
    return None

def get_interconnector_code(bmunit_code: str):
    interconnector = get_interconnector(bmunit_code)
    if interconnector:
        return interconnector.code4
    return None

def get_foreign_market(interconnector: Interconnector) -> ForeignMarket:
    for market in foreign_markets:
        if interconnector in market.interconnectors:
            return market
    return None

def get_foreign_market_from_interconnector() -> Dict[str, ForeignMarketKey]:
    outputs = {}
    for market in foreign_markets:
        for interconnector in market.interconnectors:
            outputs[interconnector.code4] = market.key
    return outputs

INTERCONNECTOR_COORDS = {i.code4: i.coords.model_dump() for m in foreign_markets for i in m.interconnectors}
FOREIGN_MARKET_COORDS = {m.key.value: m.coords.model_dump() for m in foreign_markets}

INTERCONNECTOR_FOREIGN_MARKETS = get_foreign_market_from_interconnector()