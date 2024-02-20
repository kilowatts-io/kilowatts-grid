import requests, logging

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1"


def get_api_response(path: str, params: dict) -> dict:
    url = BASE_URL + path
    logging.info(f"getting {url} with {params}")
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()
