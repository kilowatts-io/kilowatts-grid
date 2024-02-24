# use the sheffield solar API to get current solar power generation
from time import sleep
import requests, pandas as pd, logging, json, os
from pydantic import BaseModel
from datetime import datetime
from typing import List
from ..ptypes import SheffieldGspSnapshot
from multiprocessing import Pool, cpu_count


GSP_CSV_FP = os.path.join(os.path.dirname(__file__), "gsp_points.csv")


# class RawGspResponse(BaseModel):
#     data: List[List[any]]
#     meta: List[str]


class SheffieldGspResponse(BaseModel):
    settlementPeriod: int
    startTime: datetime
    mw: float


def get_and_retry_with_backoff(url, retries=15):
    for i in range(retries):
        resp = requests.get(url)
        if resp.status_code == 200:
            return resp
        print(f"Failed to get data from Sheffield Solar API: {resp.text}")
        sleep(2**i)
    raise Exception(f"Failed to get data from Sheffield Solar API: {resp.text}")


class SheffieldGsp(BaseModel):

    gsp_id: int

    def run(self):
        url = f"https://api.solar.sheffield.ac.uk/pvlive/api/v4/pes/{self.gsp_id}"
        resp = get_and_retry_with_backoff(url)
        raw_data = resp.json()["data"]

        if len(raw_data) == 0:
            return None

        data = [
            SheffieldGspResponse(
                settlementPeriod=settlementPeriod, startTime=startTime, mw=mw
            )
            for settlementPeriod, startTime, mw in raw_data
        ]

        # print(self.gsp_id, data[0].mw, data[0].startTime, data[0].settlementPeriod)

        return float(data[0].mw)


def get_gsp_data(gsp: SheffieldGsp):
    """Get the current solar power generation from Sheffield Solar API"""
    print(f"Getting data for GSP {gsp.gsp_id}")
    return gsp.run()


class SheffieldGsps(BaseModel):
    """Sheffield GSP data model"""

    dt: datetime

    def run(self) -> List[SheffieldGspSnapshot]:
        """Get the current solar power generation from Sheffield Solar API"""
        df = self._import_csv_data()
        # filter to remove those with null gsp_id
        df = df[df["gsp_id"].notnull()]
        gsps = [SheffieldGsp(gsp_id=int(gsp_id), dt=self.dt) for gsp_id in df["gsp_id"]]
        mw = [get_gsp_data(gsp) for gsp in gsps]
        # with Pool(cpu_count()) as p:
        #     mw = p.map(get_gsp_data, gsps)
        df["mw"] = mw
        import pdb

        pdb.set_trace()

    def _import_csv_data(self) -> pd.DataFrame:
        """Import the Sheffield Solar data from the CSV file"""
        return pd.read_csv(GSP_CSV_FP)


if __name__ == "__main__":
    now = datetime.now().replace(minute=0, second=0, microsecond=0)
    dt = now.replace(minute=now.minute + 1)
    sg = SheffieldGsps(dt=dt)
    sg.run()
