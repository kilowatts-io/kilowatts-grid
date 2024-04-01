from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Optional
from .ptypes import FromToParams
from .api import get_api_response
import pandas as pd
from .base import BaseElexonRequest
import logging


class RawMelsRecord(BaseModel):
    timeFrom: datetime
    timeTo: datetime
    levelFrom: float
    levelTo: float
    notificationTime: datetime
    bmUnit: Optional[str] = None
    # dataset: str
    # settlementDate: date
    # settlementPeriod: int = Field(..., ge=1, le=50)
    # notificationSequence: int
    # nationalGridBmUnit: Optional[str] = None


class RawMelsResponse(BaseModel):
    data: List[RawMelsRecord]


class MelsRequest(BaseElexonRequest, BaseModel):
    params: FromToParams

    def run(self) -> pd.Series:
        raw = self._get_raw_data()
        return self._parse_raw_data(raw)

    def _get_raw_data(self):
        path = "/datasets/mels"
        params = self.params.model_dump()
        return RawMelsResponse(**get_api_response(path, params))

    def _parse_raw_data(self, raw: RawMelsResponse) -> pd.Series:
        """get the most recent value at self.dt for each BMU"""
        logging.info(
            f"parsing {len(raw.data)} mels records for {self.params.model_dump_json()}..."
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
            for notificationTime, n_group in group.groupby("notificationTime"):
                levels = self._get_levels(n_group)
                if self._covers_relevant_period(levels):
                    output[bmUnit] = levels[levels.index <= self.dt].iloc[-1]
        logging.info(f"parsed mels data for {self.dt} - returned {len(output)} records")
        series = pd.Series(output)
        if series.empty:
            raise Exception(
                f"no data returned from mels request for {self.params.model_dump_json()}"
            )

        return series
