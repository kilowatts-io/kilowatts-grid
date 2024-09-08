import pandas as pd
from typing import List
from datetime import datetime
from interconnectors import (
    INTERCONNECTORS,
    get_interconnector_code,
    INTERCONNECTOR_FOREIGN_MARKETS,
    FOREIGN_MARKET_COORDS,
)
from ...types import ForeignMarketSnapshot, InterconnectorSnapshot, TotalsSnapshot
from pydantic import BaseModel
from ...logs import logging


class ForeignMarketTotals(BaseModel):
    bm: pd.DataFrame
    model_config = {"arbitrary_types_allowed": True}

    def run(self) -> List[ForeignMarketSnapshot]:
        started = datetime.now()
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
                del idf["cp"]
                i = INTERCONNECTORS[interconnector]
                interconnectors.append(
                    InterconnectorSnapshot(
                        code=interconnector,
                        coords=i.coords.model_dump(),
                        **idf.sum().to_dict(),
                        cp=i.capacity,
                    )
                )
            f_coords = FOREIGN_MARKET_COORDS[foreign_market]
            foreign_markets.append(
                ForeignMarketSnapshot(
                    code=foreign_market,
                    coords=f_coords,
                    interconnectors=interconnectors,
                )
            )

        totals = TotalsSnapshot(
            name="Interconnectors",
            code="interconnector",
            **self.bm[["ac", "bids", "offers", "cp", "dl"]].sum().to_dict(),
        )

        logging.info(f"foreign market totals complete in {datetime.now() - started}")

        return foreign_markets, totals
