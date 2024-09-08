import json
from ...logs import logging
from typing import List, Union
from pydantic import BaseModel
import requests
from ... import types as t
from ... import s3

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1"


class BaseElexonStreamRequest(BaseModel):
    """Base class for Elexon stream requests providing common functionality for subclasses."""

    from_to: t.FromToParams
    path: str

    def run(self) -> List[Union[t.RawMelsRecord, t.RawPnRecord, t.RawBoalfRecord]]:
        """Run the request and parse the retrieved data."""
        try:
            raw_data = self._get_raw_response()
            resp = self._parse_raw_data(raw_data)
            self._write_s3(json.dumps([json.loads(x.model_dump_json()) for x in resp]))
            return resp
        except Exception as e:
            logging.info(f"Error fetching fresh data, reading from S3: {e}")
            self._read_cache()
    
    def _cache_path(self):
        return f"{self.path}.json"
    
    def _write_s3(self, body: str):
        s3.write_to_s3(body, self.path)
    
    def _read_s3(self) -> str:
        return s3.read_from_s3(self.path)
    
    def _read_cache(self):
        raise NotImplementedError("Subclasses must implement the _read_cache method")

    def _get_raw_response(self) -> dict:
        """Make an HTTP GET request to the Elexon API and return the JSON response."""
        url = BASE_URL + self.path
        params = self.from_to.model_dump()
        logging.debug(f"Fetching data from {url} with params {params}")
        try:
            response = requests.get(url, params=params, timeout=25)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            msg = f"Failed to fetch {self.path}"
            logging.error(url, json.dumps(params))
            raise requests.RequestException(msg) from e

    def _parse_raw_data(
        self, data: dict
    ) -> List[Union[t.RawMelsRecord, t.RawPnRecord, t.RawBoalfRecord]]:
        """Parse raw JSON data into typed records. Needs to be overridden by subclasses."""
        raise NotImplementedError(
            "Subclasses must implement the _parse_raw_data method"
        )

class MelsStreamRequest(BaseElexonStreamRequest):
    """Request class for retrieving MELS data from the Elexon API."""
    cache: bool = True
    path: str = "/datasets/mels/stream"
    
    def _read_cache(self):
        data = self._read_s3()
        return [t.RawMelsRecord(**item) for item in json.loads(data)]

    def _parse_raw_data(self, data: dict) -> List[t.RawMelsRecord]:
        return [t.RawMelsRecord(**item) for item in data]

class PnStreamRequest(BaseElexonStreamRequest):
    """Request class for retrieving PN data from the Elexon API."""
    path: str = "/datasets/pn/stream"
    cache: bool = True

    def _parse_raw_data(self, data: dict) -> List[t.RawPnRecord]:
        return [t.RawPnRecord(**item) for item in data]
    
    def _read_cache(self):
        data = self._read_s3()
        return [t.RawPnRecord(**item) for item in json.loads(data)]


class BoalfStreamRequest(BaseElexonStreamRequest):
    """Request class for retrieving BOALF data from the Elexon API."""

    path: str = "/datasets/boalf/stream"

    def _parse_raw_data(self, data: dict) -> List[t.RawBoalfRecord]:
        return [t.RawBoalfRecord(**item) for item in data]
    
    def _read_cache(self):
        data = self._read_s3()
        return [t.RawBoalfRecord(**item) for item in json.loads(data)]
