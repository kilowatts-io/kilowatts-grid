# gets the latest capacity totals for the national grid distribution networks for wind and solar

import pandas as pd, requests, os

# write to current module directory
CAPACITY_TOTALS_CSV_FP = os.path.join(os.path.dirname(__file__), "capacity_totals.csv")
BASE_API = "https://connecteddata.nationalgrid.co.uk"
INITIAL_URL = f"{BASE_API}/api/3/action/datastore_search?resource_id=0baf38d3-8f7a-41e5-ad17-8d5785877f8c"


CAPACITY_COLUMN = "Connected Maximum Export Capacity (MW)"
TECHNOLOGY_COLUMN = "Energy Source 1"
DNO_REGION_COLUMN = "Licence Area"

COLUMNS_TO_KEEP = [
    DNO_REGION_COLUMN,
    TECHNOLOGY_COLUMN,
    CAPACITY_COLUMN,
]

SIMPLER_COLUMN_NAMES = {
    "Connected Maximum Export Capacity (MW)": "cp",
    "Energy Source 1": "technology",
    "Licence Area": "region",
}

SOLAR_TECHNOLOGY_NAME = "Solar"
WIND_TECHNOLOGY_NAME = "Wind"

TECHNOLOGIES_TO_KEEP = [SOLAR_TECHNOLOGY_NAME, WIND_TECHNOLOGY_NAME]


def get_capacity_register():
    url = INITIAL_URL
    data = []
    complete = False
    while not complete:
        response = requests.get(url)
        response.raise_for_status()
        as_dict = response.json()
        new_records = as_dict["result"]["records"]
        data.extend(new_records)
        if len(new_records) > 0:
            next_url = as_dict["result"]["_links"]["next"]
            url = f"{BASE_API}{next_url}"
            print(url)
        else:
            complete = True

    df = pd.DataFrame(data)[COLUMNS_TO_KEEP]
    df = df[df[TECHNOLOGY_COLUMN].isin(TECHNOLOGIES_TO_KEEP)]
    df = df.rename(columns=SIMPLER_COLUMN_NAMES)
    df["technology"] = df["technology"].str.lower()

    df = df.groupby(
        [
            "region",
            "technology",
        ]
    ).sum()

    df.to_csv(CAPACITY_TOTALS_CSV_FP)


if __name__ == "__main__":
    resp = get_capacity_register()
