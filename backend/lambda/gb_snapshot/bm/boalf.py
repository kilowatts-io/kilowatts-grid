from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional
from ..interpolate.interpolate import interpolate_dt
from .ptypes import FromToParams
from .api import get_api_response
import pandas as pd
from .base import BaseElexonRequest
import logging


class RawBoalfRecord(BaseModel):
    timeFrom: datetime
    timeTo: datetime
    levelFrom: float
    levelTo: float
    acceptanceNumber: int
    acceptanceTime: datetime
    bmUnit: Optional[str] = None
    # deemedBoFlag: bool
    # soFlag: bool
    # amendmentFlag: str
    # storFlag: bool
    # rrFlag: bool


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
    levels: pd.Series
    model_config = {"arbitrary_types_allowed": True}


class BoalfRequest(BaseElexonRequest, BaseModel):
    params: FromToParams

    def run(self) -> pd.Series:
        raw = self._get_raw_data()
        return self._parse_raw_data(raw)

    def _get_raw_data(self) -> RawBoalfResponse:
        path = "/datasets/boalf"
        params = self.params.model_dump()
        response = get_api_response(path, params)
        return RawBoalfResponse(**response)

    def _parse_raw_data(self, raw: RawBoalfResponse) -> pd.DataFrame:
        """get the most recent value at self.dt for each BMU"""
        logging.info(
            f"parsing {len(raw.data)} boalf records for {self.params.model_dump_json()}..."
        )
        data = [r.model_dump() for r in raw.data]
        if len(data) == 0:
            logging.info(f"no boalf data for {self.params}")
            output = {}
            return pd.DataFrame(columns=["level", "delta"], index=output.keys())

        df = pd.DataFrame(data)
        df = df.dropna(subset=["bmUnit"])
        output = {}
        for bmUnit, group in df.groupby("bmUnit"):
            for _acceptanceNumber, levels in group.sort_values(
                "acceptanceTime"
            ).groupby("acceptanceNumber"):
                levels = self._get_levels(levels)
                if self._covers_relevant_period(levels):
                    value = interpolate_dt(self.dt, levels)
                    output[bmUnit] = value.model_dump()
        logging.info(
            f"parsed boalf data for {self.params} - returned {len(output)} records"
        )
        return pd.DataFrame(
            data=output.values(), index=output.keys(), columns=["level", "delta"]
        )
