import asyncio
from typing import Union

import pytz
from .ptypes import SettlementPeriodParams, FromToParams
from datetime import timedelta, timezone
import pandas as pd
from .boalf import BoalfRequest
from .pn import PnRequest
from .mels import MelsRequest
import logging
from pydantic import BaseModel
from datetime import datetime


def get_data(args):
    target, dt, from_to, sp = args
    if target == "boalf":
        return BoalfRequest(dt=dt, params=from_to).run()
    elif target == "mels":
        return MelsRequest(dt=dt, params=from_to).run()
    elif target == "pn":
        return PnRequest(dt=dt, params=sp).run()


class Bm(BaseModel):
    dt: datetime

    def run(self) -> pd.DataFrame:
        boalf, pn, mels = self._get_data()
        return self._join(boalf, pn, mels)

    def _get_from_to_params(self) -> FromToParams:
        from_ = self._get_start_settlement_period()
        return FromToParams(dt=self.dt, from_=from_, to=from_ + timedelta(minutes=30))

    def _get_start_settlement_period(self):
        if self.dt.minute >= 30:
            return self.dt.replace(minute=30)
        else:
            return self.dt.replace(minute=0)

    def _most_recent_midnight(self, dt: datetime):
        """get the most recent midnight in london. dt is in utc"""
        london_time = dt.astimezone(pytz.timezone("Europe/London"))
        london_midnight = london_time.replace(hour=0, minute=0, second=0, microsecond=0)
        midnight_in_utc = london_midnight.astimezone(pytz.utc)
        return midnight_in_utc

    def _get_settlement_period_params(self) -> SettlementPeriodParams:
        start = self._get_start_settlement_period()
        midnight = self._most_recent_midnight(start)
        settlementPeriod = int((start - midnight) / timedelta(minutes=30) + 1)

        return SettlementPeriodParams(
            dt=self.dt,
            settlementDate=start.date(),
            settlementPeriod=settlementPeriod,
        )

    def _get_data(self) -> Union[pd.Series, pd.Series, pd.Series]:
        """get data in parallel and return as a tuple"""
        logging.info(f"getting bm data for {self.dt}")
        from_to = self._get_from_to_params()
        sp = self._get_settlement_period_params()
        # args = [(target, self.dt, from_to, sp) for target in ["boalf", "mels", "pn"]]
        # with Pool(3) as p:
        #     boalf, mels, pn = p.map(get_data, args)
        # use multiple threads to get data in parallel

        boalf = BoalfRequest(dt=self.dt, params=from_to).run()
        mels = MelsRequest(dt=self.dt, params=from_to).run()
        pn = PnRequest(dt=self.dt, params=sp).run()

        # boalf = asyncio.run(get_data(self.dt, from_to, sp))

        logging.info(f"got pn -- all bm data complete")
        return boalf, pn, mels

    def _join(self, boalf: pd.Series, pn: pd.Series, mels: pd.Series) -> pd.DataFrame:
        """create a dataframe with columns ac (actual output mw), bv (balancing volume mw), cp (capacity mw)"""
        logging.info(f"joining bm data")

        df = mels.to_frame("cp")

        pn.columns = ["pn_level", "pn_delta"]
        df = df.join(pn)

        df["pn_level"] = df["pn_level"].fillna(0)

        boalf.columns = ["boalf_level", "boalf_delta"]
        df = df.join(boalf)

        df["ac"] = df["boalf_level"].fillna(df["pn_level"])
        df["dl"] = df["boalf_delta"].fillna(df["pn_delta"]).fillna(0)

        df["bv"] = df["ac"] - df["pn_level"]
        df["offers"] = df["bv"].apply(lambda x: x if x > 0 else 0)
        df["bids"] = df["bv"].apply(lambda x: -x if x < 0 else 0)

        df = df[["ac", "bids", "offers", "cp", "dl"]]
        df = df.sort_values(["ac", "cp"])

        logging.info(f"joined bm data")
        return df
