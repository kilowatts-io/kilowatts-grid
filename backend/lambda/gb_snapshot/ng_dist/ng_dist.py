from typing import List, Union
from pydantic import BaseModel, Field
import pandas as pd, requests
from ..ptypes import NationalGridGspSnapshot
from .capacity import CAPACITY_TOTALS_CSV_FP
import logging


NATIONAL_GRID_DISTRIBUTION_NETWORKS = [
    {
        "id": 11,
        "name": "East Midlands",
        "coords": {
            "solar": {
                # leicester
                "lat": 52.6369,
                "lng": -1.1398,
            },
            "wind": {
                # skegness
                "lat": 53.144,
                "lng": 0.336,
            },
        },
        "url": "https://connecteddata.nationalgrid.co.uk/dataset/7235194a-884d-47ff-bd03-a0ad38eedcb3/resource/92d3431c-15d7-4aa6-ad34-2335596a026c/download/eastmidlands.csv",
        "embedded_capacity_register_name": "Western Power Distribution (East Midlands) Plc",
    },
    {
        "id": 14,
        "name": "West Midlands",
        "coords": {
            # telford
            "solar": {
                # telford
                "lat": 52.6784,
                "lng": -2.4453,
            },
            "wind": {
                # birmingham
                "lat": 52.4862,
                "lng": -1.8904,
            },
        },
        "url": "https://connecteddata.nationalgrid.co.uk/dataset/7235194a-884d-47ff-bd03-a0ad38eedcb3/resource/1c3447df-37d7-4fb4-9f99-0e2a0d691dbe/download/westmidlands.csv",
        "embedded_capacity_register_name": "Western Power Distribution (West Midlands) Plc",
    },
    {
        "id": 21,
        "name": "South Wales",
        "coords": {
            "solar": {
                # cardiff
                "lat": 51.4816,
                "lng": -3.1791,
            },
            "wind": {
                # llandovery
                "lat": 51.995,
                "lng": -3.802,
            },
        },
        "url": "https://connecteddata.nationalgrid.co.uk/dataset/7235194a-884d-47ff-bd03-a0ad38eedcb3/resource/38b81427-a2df-42f2-befa-4d6fe9b54c98/download/southwales.csv",
        "embedded_capacity_register_name": "Western Power Distribution (South Wales) Plc",
    },
    {
        "id": 22,
        "name": "South West",
        "coords": {
            "wind": {
                # truro
                "lat": 50.2632,
                "lng": -5.051,
            },
            "solar": {
                # yeovil
                "lat": 50.9421,
                "lng": -2.6336,
            },
        },
        "url": "https://connecteddata.nationalgrid.co.uk/dataset/7235194a-884d-47ff-bd03-a0ad38eedcb3/resource/85aaa199-15df-40ec-845f-6c61cbedc20f/download/southwest.csv",
        "embedded_capacity_register_name": "Western Power Distribution (South West) Plc",
    },
]


class InterpolatedValue(BaseModel):
    ac: float
    dl: float


class NationalGridDistributionNetworkResponse(BaseModel):
    solar: InterpolatedValue
    wind: InterpolatedValue


class NationalGridDistributionNetwork(BaseModel):
    id: int
    name: str
    coords: dict
    url: str

    def run(self):
        logging.info(f"running NationalGridDistributionNetwork for {self.name}...")

        resp = requests.get(self.url, headers={})
        lines = resp.text.split("\r\n")
        columns = lines[0].split(",")
        rows = [line.split(",") for line in lines[1:-1]]
        data = []
        for row in rows:
            float_values = [float(x) if x != "" else None for x in row[1:]]
            as_dict = dict(zip(columns[1:], float_values))
            data.append({"Timestamp": row[0], **as_dict})
        df = pd.DataFrame(data)
        # set Timestamp as index
        df.set_index("Timestamp", inplace=True)
        # set all columns as floats
        df = df.astype(float)
        # set Timestamp as UTC
        df.index = pd.to_datetime(df.index, utc=True)
        # sort index
        df.sort_index(inplace=True)
        # get latest
        most_recent = df.iloc[-1]
        # assert latest is less than 10 minutes old
        assert (pd.Timestamp.now(tz="UTC") - most_recent.name) < pd.Timedelta(
            "10 minutes"
        )

        previous = df.iloc[-2]

        time_diff_minutes = (most_recent.name - previous.name).seconds / 60

        return NationalGridDistributionNetworkResponse(
            solar=InterpolatedValue(
                ac=most_recent["Solar"],
                dl=(most_recent["Solar"] - previous["Solar"]) / time_diff_minutes,
            ),
            wind=InterpolatedValue(
                ac=most_recent["Wind"],
                dl=(most_recent["Wind"] - previous["Wind"]) / time_diff_minutes,
            ),
        )


class NationalGridDistributionNetworks:
    def run(self) -> Union[None, List[NationalGridGspSnapshot]]:
        logging.info("running NationalGridDistributionNetworks...")
        capacities = self._read_capacity_totals()
        try:
            results = []
            for network in NATIONAL_GRID_DISTRIBUTION_NETWORKS:

                ngdn = NationalGridDistributionNetwork(**network)
                response = ngdn.run()
                # add solar and wind
                kwargs = {
                    "bids": 0,
                    "offers": 0,
                }

                results.append(
                    NationalGridGspSnapshot(
                        name=network["name"],
                        code=f'NGDNO-{network["id"]}-solar',
                        fuel_type="solar",
                        coords=network["coords"]["solar"],
                        ac=response.solar.ac,
                        dl=response.solar.dl,
                        cp=capacities.loc[
                            (network["embedded_capacity_register_name"], "solar")
                        ]["cp"],
                        **kwargs,
                    )
                )
                results.append(
                    NationalGridGspSnapshot(
                        name=network["name"],
                        code=f'NGDNO-{network["id"]}-wind',
                        fuel_type="wind",
                        ac=response.wind.ac,
                        dl=response.wind.dl,
                        cp=capacities.loc[
                            (network["embedded_capacity_register_name"], "wind")
                        ]["cp"],
                        coords=network["coords"]["wind"],
                        **kwargs,
                    )
                )
            logging.info("NationalGridDistributionNetworks completed.")
            return results

        except Exception as e:
            print(e)
            return None

    def _read_capacity_totals(self):
        df = pd.read_csv(CAPACITY_TOTALS_CSV_FP)
        df.set_index(["region", "technology"], inplace=True)
        return df


if __name__ == "__main__":
    results = NationalGridDistributionNetworks().run()
    print(results)
