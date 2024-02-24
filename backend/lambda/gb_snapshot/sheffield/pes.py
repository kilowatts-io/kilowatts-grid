# use the sheffield solar API to get current solar power generation
from time import sleep
import requests, pandas as pd, logging, json, os
from pydantic import BaseModel
from datetime import datetime
from typing import List
from ..ptypes import SheffieldGspSnapshot
from multiprocessing import Pool, cpu_count

PES = [
    {
        "id": 10,
        "name": "E. Anglia (total)",
        "coords": {
            # norwich
            "lat": 52.6309,
            "lng": 1.2974,
        },
    },
    {
        "id": 11,
        "name": "E. Midlands (total)",
        "coords": {
            # leicester
            "lat": 52.6369,
            "lng": -1.1398,
        },
    },
    {
        "id": 12,
        "name": "London (total)",
        "coords": {
            # westminster
            "lat": 51.5074,
            "lng": -0.1278,
        },
    },
    {
        "id": 13,
        "name": "Merseyside + N. Wales (total)",
        "coords": {
            # liverpool
            "lat": 53.4084,
            "lng": -2.9916,
        },
    },
    {
        "id": 14,
        "name": "W. Midlands (total)",
        "coords": {
            # telford
            "lat": 52.6784,
            "lng": -2.4453,
        },
    },
    {
        "id": 15,
        "name": "N. East (total)",
        "coords": {
            # belsay
            "lat": 55.0833,
            "lng": -1.8667,
        },
    },
    {
        "id": 16,
        "name": "N. West (total)",
        "coords": {
            # grasmere
            "lat": 54.4667,
            "lng": -3.0167,
        },
    },
    {
        "id": 17,
        "name": "N. Scotland (total)",
        "coords": {
            # gairloch
            "lat": 57.7167,
            "lng": -5.6667,
        },
    },
    {
        "id": 18,
        "name": "S. Scotland (total)",
        "coords": {
            # glasgow
            "lat": 55.8642,
            "lng": -4.2518,
        },
    },
    {
        "id": 19,
        "name": "S. East (total)",
        "coords": {
            # crawley
            "lat": 51.1167,
            "lng": -0.1833,
        },
    },
    {
        "id": 20,
        "name": "South (total)",
        "coords": {
            # andover
            "lat": 51.2117,
            "lng": -1.4927,
        },
    },
    {
        "id": 21,
        "name": "S. Wales (total)",
        "coords": {
            # llandovery
            "lat": 51.992,
            "lng": -3.802,
        },
    },
    {
        "id": 22,
        "name": "S. West (total)",
        "coords": {
            # okehampton
            "lat": 50.732,
            "lng": -3.982,
        },
    },
    {
        "id": 23,
        "name": "Yorkshire (total)",
        "coords": {
            # ripon
            "lat": 54.1333,
            "lng": -1.5167,
        },
    },
]


class Coords(BaseModel):
    lat: float
    lng: float


class SheffieldPesResponse(BaseModel):
    settlementPeriod: int
    startTime: datetime
    ac: float
    cp: float


def get_and_retry_with_backoff(url, retries=15):
    for i in range(retries):
        resp = requests.get(url)
        if resp.status_code == 200:
            return resp
        print(f"Failed to get data from Sheffield Solar API: {resp.text}")
        sleep(2**i)
    raise Exception(f"Failed to get data from Sheffield Solar API: {resp.text}")


class SheffieldPes(BaseModel):
    dt: datetime
    id: int
    name: str
    coords: Coords

    def run(self) -> SheffieldPesResponse:
        url = f"https://api.solar.sheffield.ac.uk/pvlive/api/v4/pes/{self.id}?extra_fields=capacity_mwp"
        resp = get_and_retry_with_backoff(url)
        raw_data = resp.json()["data"]

        if len(raw_data) == 0:
            return None

        data = [
            SheffieldPesResponse(
                settlementPeriod=settlementPeriod, startTime=startTime, ac=ac, cp=cp
            )
            for settlementPeriod, startTime, ac, cp in raw_data
        ]
        return data[0]


def get_pes_data(pes: SheffieldPes):
    return pes.run()


class SheffieldPess(BaseModel):
    """Sheffield GSP data model"""

    dt: datetime

    def run(self) -> List[SheffieldGspSnapshot]:
        """Get the current solar power generation from Sheffield Solar API"""
        pess = [SheffieldPes(**x, dt=self.dt) for x in PES]
        # mw = [get_pes_data(gsp) for gsp in pess]
        with Pool(cpu_count()) as p:
            mws = p.map(get_pes_data, pess)

        return [
            SheffieldGspSnapshot(
                bids=0,
                offers=0,
                fuel_type="solar",
                name=x["name"],
                code=f"solar_pes_{x['id']}",
                # need to update
                cp=r.cp,
                # need to update
                dl=0,
                ac=r.ac,
                coords=x["coords"],
                dt=self.dt,
            )
            for x, r in zip(PES, mws)
        ]


if __name__ == "__main__":
    now = datetime.now().replace(minute=0, second=0, microsecond=0)
    dt = now.replace(minute=now.minute + 1)
    sg = SheffieldPess(dt=dt)
    sg.run()
