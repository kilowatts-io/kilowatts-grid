from .ptypes import RequestParams, EmbeddedSnapshot, EmbeddedGeneration
import logging, requests, pandas as pd
from pydantic import BaseModel
from typing import List
from .interpolate.interpolate import interpolate_dt

BASE_URL = "https://api.nationalgrideso.com/api/3/action/datastore_search?resource_id=db6c038f-98af-4570-ab60-24d71ebd0ae5&limit=3"


class RawEmbeddedResponseRecord(BaseModel):
    _id: int
    DATE_GMT: str
    TIME_GMT: str
    SETTLEMENT_DATE: str
    SETTLEMENT_PERIOD: int
    EMBEDDED_WIND_FORECAST: int
    EMBEDDED_WIND_CAPACITY: int
    EMBEDDED_SOLAR_FORECAST: int
    EMBEDDED_SOLAR_CAPACITY: int


class RawEmbeddedResponseResult(BaseModel):
    records: List[RawEmbeddedResponseRecord]


class RawEmbeddedResponse(BaseModel):
    result: RawEmbeddedResponseResult


def parse_date(DATE_GMT: pd.Series, TIME_GMT: pd.Series) -> pd.Series:
    """parse DATE_GMT which is in format %Y-%m-%dT00:00:00 and TIME_GMT which is in format %H:%M"""
    date_gmt = DATE_GMT.str.split("T").str[0]
    return pd.to_datetime(date_gmt + " " + TIME_GMT + "Z")


class Embedded(RequestParams):

    def run(self) -> EmbeddedSnapshot:
        logging.debug(f"Running Embedded with {self}")
        raw = self._get_raw_data()
        return self._interpolate_to_snapshot(raw)

    def _get_raw_data(self) -> RawEmbeddedResponse:
        response = requests.get(BASE_URL)
        response.raise_for_status()
        logging.debug(f"Response: {response.json()}")
        return RawEmbeddedResponse(**response.json())

    def _interpolate_to_snapshot(self, raw: RawEmbeddedResponse) -> EmbeddedSnapshot:
        dt = self.dt
        df = pd.DataFrame([r.model_dump() for r in raw.result.records])
        df.index = parse_date(df.DATE_GMT, df.TIME_GMT)
        df = df.drop(
            columns=["DATE_GMT", "TIME_GMT", "SETTLEMENT_DATE", "SETTLEMENT_PERIOD"]
        )

        def interpolate(series: pd.Series) -> pd.Series:
            return interpolate_dt(dt, series)

        return EmbeddedSnapshot(
            dt=dt,
            wind=EmbeddedGeneration(
                capacity=interpolate(df.EMBEDDED_WIND_CAPACITY).level,
                generation=interpolate(df.EMBEDDED_WIND_FORECAST),
            ),
            solar=EmbeddedGeneration(
                capacity=interpolate(df.EMBEDDED_SOLAR_CAPACITY).level,
                generation=interpolate(df.EMBEDDED_SOLAR_FORECAST),
            ),
        )
