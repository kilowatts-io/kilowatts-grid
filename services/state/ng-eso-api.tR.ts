import * as t from "../../common/types";
import log from "../log";

export const queries = {
  embeddedWindAndSolarForecast: (
    r: t.NgEsoEmbeddedWindAndSolarForecastRawResponse
  ): t.NgEsoEmbeddedWindAndSolarForecastParsedResponse => {
    log.debug(
      "ngEsoApi.queries.embeddedWindAndSolarForecast: validating response using yup"
    );
    t.ngEsoEmbeddedWindAndSolarForecastRawResponse.validateSync(r, {
      strict: true,
    });
    log.debug(
      `ngEsoApi.queries.embeddedWindAndSolarForecast: ${r.result.records.length} records found.. transformResponse`
    );
    const output: t.NgEsoEmbeddedWindAndSolarForecastParsedResponse = [];
    for (const record of r.result.records) {
      const { DATE_GMT, TIME_GMT } = record;
      // truncate 2023-12-21T00:00:00 to 2023-12-21
      const date = new Date(DATE_GMT).toISOString().split("T")[0];
      const time = new Date(Date.parse(`${date}T${TIME_GMT}Z`)).toISOString();
      output.push({
        time,
        wind: {
          level: record.EMBEDDED_WIND_FORECAST,
          capacity: record.EMBEDDED_WIND_CAPACITY,
        },
        solar: {
          level: record.EMBEDDED_SOLAR_FORECAST,
          capacity: record.EMBEDDED_SOLAR_CAPACITY,
        },
      });
    }
    return output
  },
};
