from typing import Dict, Union

from ... import types as t

# Interconnectors

brtn = t.Interconnector(
    code4="BRTN",
    code2=["IB"],
    name="Britned",
    coords={"lat": 51.44298, "lng": 0.70782},
    market="nl",
    capacity=1000,
)

ifa2 = t.Interconnector(
    code4="IFA2",
    code2=["I2"],
    name="IFA2",
    coords={"lat": 50.81031, "lng": -1.193889},
    market="fr",
    capacity=1000,
)

nemo = t.Interconnector(
    code4="NEMO",
    code2=["IN"],
    name="Nemo",
    coords={"lat": 51.3113, "lng": 1.3456},
    market="be",
    capacity=1000,
)

ewic = t.Interconnector(
    code4="EWIC",
    code2=["IE", "II"],
    name="Republic of Ireland",
    coords={"lat": 53.227222, "lng": -3.072778},
    market="ie",
    capacity=500,
)

moyl = t.Interconnector(
    code4="MOYL",
    code2=["IM"],
    name="Moyle",
    coords={"lat": 54.65, "lng": -4.9},
    market="ie",
    capacity=500,
)

vikl = t.Interconnector(
    code4="VKL",
    code2=["IV"],
    name="Viking",
    coords={"lat": 53.35, "lng": 0.2},
    market="dk",
    capacity=1400,
)

nsl = t.Interconnector(
    code4="NSL1",
    code2=["IS"],
    name="NSL",
    coords={"lat": 55.145, "lng": -1.521},
    market="no",
    capacity=1400,
)

ifa1 = t.Interconnector(
    code4="IFA1",
    code2=["IF"],
    name="IFA",
    coords={"lat": 51.104, "lng": 1.35},
    market="fr",
    capacity=2000,
)

elec = t.Interconnector(
    code4="ELEC",
    code2=["IL"],
    name="Eleclink",
    coords={"lat": 51, "lng": 1},
    market="fr",
    capacity=1000,
)

# foreign markets
fr = t.ForeignMarket(
    key=t.ForeignMarketKey.fr,
    coords={"lat": 50, "lng": 2.5},
    interconnectors=[elec, ifa1, ifa2],
)

be = t.ForeignMarket(
    key=t.ForeignMarketKey.be, coords={"lat": 50.85, "lng": 3}, interconnectors=[nemo]
)

nl = t.ForeignMarket(
    key=t.ForeignMarketKey.nl, coords={"lat": 51.5, "lng": 3}, interconnectors=[brtn]
)

dk = t.ForeignMarket(
    key=t.ForeignMarketKey.dk,
    coords={"lat": 54.5, "lng": 1.5},
    interconnectors=[vikl],
)

no = t.ForeignMarket(
    key=t.ForeignMarketKey.no, coords={"lat": 55.6, "lng": 0.5}, interconnectors=[nsl]
)

ie = t.ForeignMarket(
    key=t.ForeignMarketKey.ie,
    coords={"lat": 53.7, "lng": -5},
    interconnectors=[ewic, moyl],
)

FOREIGN_MARKETS = [fr, be, nl, dk, no, ie]

total_interconnector_capacity = sum(
    [sum([i.capacity for i in m.interconnectors]) for m in FOREIGN_MARKETS]
)


# queries and lookups
def is_interconnector(full_code: str):
    return full_code[:2] == "I_"


def extract_code_4(full_code: str) -> str:
    return full_code.split("-")[1][:4]


def extract_code_2(full_code: str) -> str:
    return full_code.split("_")[1][:2]


def get_interconnector(bmunit_code: str) -> Union[t.Interconnector, None]:
    if not is_interconnector(bmunit_code):
        return None
    code2 = extract_code_2(bmunit_code)
    code4 = extract_code_4(bmunit_code)
    for market in FOREIGN_MARKETS:
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


def get_foreign_market(interconnector: t.Interconnector) -> t.ForeignMarket:
    for market in FOREIGN_MARKETS:
        if interconnector in market.interconnectors:
            return market
    return None


def get_foreign_markets() -> Dict[str, t.ForeignMarketKey]:
    outputs = {}
    for market in FOREIGN_MARKETS:
        for interconnector in market.interconnectors:
            outputs[interconnector.code4] = market.key
    return outputs


# lookups/constants
INTERCONNECTORS = {i.code4: i for m in FOREIGN_MARKETS for i in m.interconnectors}
FOREIGN_MARKET_COORDS = {m.key.value: m.coords for m in FOREIGN_MARKETS}


# INTERCONNECTOR_CODES = [i.code4 for m in FOREIGN_MARKETS for i in m.interconnectors]
