import { number, object, string } from "yup";

export type QueryParams = {
  year: number;
  month: number;
  day: number;
  hour: number;
};

const padder = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const query = ({ year, month, day, hour }: QueryParams): string => {
  const yYMMDDHH = `${year}${padder(month)}${padder(day)}${padder(hour)}`;
  return `/efs_demand_forecast/downloadfile?filename=${yYMMDDHH}12_Embedded_Forecast.csv`;
};

export const ngEsoEmbeddedWindAndSolarForecastValue = object({
  DATE_GMT: string().required(), // gives the date at midnight
  EMBEDDED_WIND_FORECAST: number().required(),
  EMBEDDED_WIND_CAPACITY: number().required(),
  TIME_GMT: string().required(),
  // _full_text: string().required(),
  SETTLEMENT_PERIOD: number().required(),
  SETTLEMENT_DATE: string().required(),
  EMBEDDED_SOLAR_FORECAST: number().required(),
  // _id: number().required(),
  EMBEDDED_SOLAR_CAPACITY: number().required()
});

export type NgEsoEmbeddedWindAndSolarForecastValue = {
  DATE_GMT: string;
  EMBEDDED_WIND_FORECAST: string;
  EMBEDDED_WIND_CAPACITY: string;
  TIME_GMT: string;
  // _full_text: string;
  SETTLEMENT_PERIOD: number;
  SETTLEMENT_DATE: string;
  EMBEDDED_SOLAR_FORECAST: string;
  // _id: number;
  EMBEDDED_SOLAR_CAPACITY: string;
};

export const transformResponse = (
  response: NgEsoEmbeddedWindAndSolarForecastValue[]
) => {
  for (const line of response) {
    try {
      ngEsoEmbeddedWindAndSolarForecastValue.validateSync(line);
    } catch (e: any) {
      console.error(line);
      throw Error(
        `ngEsoApi.queries.historicEmbeddedWindAndSolarForecast: ${e.message}`
      );
    }
  }

  return response;
};
