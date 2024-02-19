import pandas as pd
from typing import List
from .bm.interconnector import (
    INTERCONNECTOR_COORDS,
    get_interconnector_code,
    INTERCONNECTOR_FOREIGN_MARKETS,
    FOREIGN_MARKET_COORDS,
)
from .ptypes import ForeignMarketSnapshot, InterconnectorSnapshot, TotalsSnapshot
from pydantic import BaseModel


class ForeignMarketTotals(BaseModel):
    bm: pd.DataFrame
    model_config = {"arbitrary_types_allowed": True}

    def run(self) -> List[ForeignMarketSnapshot]:
        self.bm["interconnector"] = [get_interconnector_code(x) for x in self.bm.index]
        self.bm = self.bm[self.bm["interconnector"].notna()]
        self.bm["foreign_market"] = [
            INTERCONNECTOR_FOREIGN_MARKETS[x].value for x in self.bm["interconnector"]
        ]
        foreign_markets = []

        for foreign_market, fdf in self.bm.groupby("foreign_market"):
            del fdf["foreign_market"]
            interconnectors = []
            for interconnector, idf in fdf.groupby("interconnector"):
                del idf["interconnector"]
                i_coords = INTERCONNECTOR_COORDS[interconnector]
                interconnectors.append(
                    InterconnectorSnapshot(
                        key=interconnector, coords=i_coords, **idf.sum().to_dict()
                    )
                )
            f_coords = FOREIGN_MARKET_COORDS[foreign_market]
            foreign_markets.append(
                ForeignMarketSnapshot(
                    key=foreign_market, coords=f_coords, interconnectors=interconnectors
                )
            )

        totals = TotalsSnapshot(
            name="Interconnectors",
            key="interconnector",
            **self.bm[["ac", "bids", "offers", "cp"]].sum().to_dict()
        )
        return foreign_markets, totals
