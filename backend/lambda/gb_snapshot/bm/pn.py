from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Optional
from .ptypes import SettlementPeriodParams
from .api import get_api_response
import pandas as pd
from .base import BaseElexonRequest
from ..interpolate.interpolate import interpolate_dt
import logging


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


class RawPnResponse(BaseModel):
    data: List[RawPnRecord]


class PnRequest(BaseElexonRequest, BaseModel):
    params: SettlementPeriodParams

    def run(self) -> pd.Series:
        raw = self._get_raw_data()
        return self._parse_raw_data(raw)

    def _get_raw_data(self) -> RawPnResponse:
        path = "/datasets/pn"
        params = self.params.model_dump()
        response = get_api_response(path, params)
        return RawPnResponse(**response)

    def _parse_raw_data(self, raw: RawPnResponse) -> pd.DataFrame:
        """interpolate to get the value for each unit"""
        logging.info(
            f"parsing {len(raw.data)} pn records for {self.params.model_dump_json()}..."
        )

        data = [r.model_dump() for r in raw.data]
        if len(data) == 0:
            raise Exception(
                "no data returned from mels request. Likely a problem with the API."
            )
        df = pd.DataFrame(data)
        df = df.dropna(subset=["bmUnit"])
        output = {}
        for bmUnit, group in df.groupby("bmUnit"):
            group = group.sort_values("timeFrom")
            levels = self._get_levels(group)
            if self._covers_relevant_period(levels):
                output[bmUnit] = interpolate_dt(self.dt, levels).model_dump()
        logging.info(
            f"parsed pn data for {self.params} -- returned {len(output)} records"
        )
        return pd.DataFrame(
            data=output.values(), index=output.keys(), columns=["level", "delta"]
        )
