from pydantic import BaseModel, Field
import requests
from .. import types as t
from ..logs import logging
from datetime import datetime
from ..interpolate import get_mels_value, interpolate_values
from datetime import UTC
from .. import s3

BASE_URL = "https://api.nationalgrideso.com/api/3/action/datastore_search?resource_id=db6c038f-98af-4570-ab60-24d71ebd0ae5"

KEY = "eso_embedded.json"

class EsoEmbedded(BaseModel):
    dt: datetime = Field(description="target output time")

    def run(self) -> t.EmbeddedSnapshot:
        """Main execution method."""
        logging.debug("Running Embedded ESO data fetch")
        data = self._get_data()
        return self._interpolate(data)
        
    def _get_data(self) -> t.EmbeddedSnapshot:
        try:
            data = self._get_fresh_data()
            logging.info("Fetched fresh data from ESO API")
        except Exception as e:
            data = self._read_s3()
            logging.info(f"Error fetching fresh data, reading from S3: {e}")
        return data
        
    def _get_fresh_data(self) -> t.EmbeddedSnapshot:
        raw = self._get_raw_data()
        parsed = self._parse(raw)
        self._write_s3(parsed)
        return parsed
    
    def _write_s3(self, s: t.EmbeddedSnapshot):
        s3.write_to_s3(s.model_dump_json(), KEY)
        
    def _read_s3(self) -> t.EmbeddedSnapshot:
        return t.EmbeddedSnapshot(**s3.read_from_s3(KEY))

    def _get_raw_data(self) -> t.EsoRawEmbeddedResponse:
        """Fetch raw data from the ESO API."""
        logging.debug(f"Fetching data from {BASE_URL}")
        try:
            response = requests.get(BASE_URL, timeout=20)
            response.raise_for_status()  # Raise an error for bad HTTP status
            return t.EsoRawEmbeddedResponse(**response.json())
        except requests.RequestException as e:
            logging.error(f"Error fetching ESO API data: {e}")
            raise

    def _parse(self, raw: t.EsoRawEmbeddedResponse) -> t.EsoEmbeddedForecast:
        """Convert the response to a more structured forecast."""
        logging.debug(f"Parsing {len(raw.result.records)} records from ESO data")
        return t.EsoEmbeddedForecast(
            obtained=datetime.now(),
            values=[self._parse_raw_record(x) for x in raw.result.records],
        )

    def _parse_raw_record(
        self, x: t.EsoRawEmbeddedResponseRecord
    ) -> t.EmbeddedForecastValue:
        """Parse an individual record into a structured format."""
        return t.EmbeddedForecastValue(
            dt=self._parse_raw_record_dt(x),
            solar_capacity=x.EMBEDDED_SOLAR_CAPACITY,
            solar_generation=x.EMBEDDED_SOLAR_FORECAST,
            wind_capacity=x.EMBEDDED_WIND_CAPACITY,
            wind_generation=x.EMBEDDED_WIND_FORECAST,
        )

    def _parse_raw_record_dt(self, x: t.EsoRawEmbeddedResponseRecord) -> datetime:
        """Parse date and time fields into a Python datetime object."""
        try:
            date_gmt = x.DATE_GMT.split("T")[0]
            time_gmt = x.TIME_GMT
            date_str = f"{date_gmt}T{time_gmt}Z"
            return datetime.strptime(date_str, "%Y-%m-%dT%H:%MZ").replace(tzinfo=UTC)
        except (ValueError, AttributeError) as e:
            logging.error(f"Error parsing date/time from record: {e}")
            raise

    def _interpolate(self, parsed: t.EsoEmbeddedForecast) -> t.EmbeddedSnapshot:
        """Interpolate the forecast to the target time"""
        logging.debug(f"Interpolating forecast to target time {self.dt}")

        if len(parsed.values) == 0:
            logging.error("No data in ESO API response")
            raise ValueError("No data in ESO API response")

        wind_generation = [
            t.LevelPair(d=x.dt, x=x.wind_generation) for x in parsed.values
        ]

        wind_capacity = [t.LevelPair(d=x.dt, x=x.wind_capacity) for x in parsed.values]

        solar_generation = [
            t.LevelPair(d=x.dt, x=x.solar_generation) for x in parsed.values
        ]

        solar_capacity = [
            t.LevelPair(d=x.dt, x=x.solar_capacity) for x in parsed.values
        ]

        return t.EmbeddedSnapshot(
            **{
                "wind": {
                    "generation": interpolate_values(wind_generation, self.dt),
                    "capacity": get_mels_value(wind_capacity, self.dt),
                },
                "solar": {
                    "generation": interpolate_values(solar_generation, self.dt),
                    "capacity": get_mels_value(solar_capacity, self.dt),
                },
            }
        )
