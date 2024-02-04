import { object, string } from "yup";
import { log } from "../../../utils/logs";

export const query = () =>
  "action/datastore_search?resource_id=db6c038f-98af-4570-ab60-24d71ebd0ae5&limit=3";

// {
//     "help": "https://api.nationalgrideso.com/api/3/action/help_show?name=datastore_search",
//     "success": true,
//     "result": {
//         "include_total": true,
//         "resource_id": "db6c038f-98af-4570-ab60-24d71ebd0ae5",
//         "fields": [
//             {
//                 "type": "int",
//                 "id": "_id"
//             },
//             {
//                 "info": {
//                     "comment": "N/A",
//                     "description": "The date for which the forecast is intended for",
//                     "title": "Forecast Date",
//                     "type": "datetime",
//                     "example": "2022-01-05T00:00:00",
//                     "unit": "N/A"
//                 },
//                 "type": "timestamp",
//                 "id": "DATE_GMT"
//             },
//             {
//                 "info": {
//                     "comment": "N/A",
//                     "description": "The time for which the forecast is intended for",
//                     "title": "Time if Forecast",
//                     "type": "string",
//                     "example": "10:30",
//                     "unit": "N/A"
//                 },
//                 "type": "text",
//                 "id": "TIME_GMT"
//             },
//             {
//                 "info": {
//                     "comment": "N/A",
//                     "description": "The period from 00:00 hours to 24:00 hours on each day;",
//                     "title": "Settlement Date",
//                     "type": "datetime",
//                     "example": "2022-01-05T00:00:00",
//                     "unit": "N/A"
//                 },
//                 "type": "timestamp",
//                 "id": "SETTLEMENT_DATE"
//             },
//             {
//                 "info": {
//                     "comment": "N/A",
//                     "description": "Period of 30 minutes beginning on the hour or the half-hour",
//                     "title": "Settlement Period",
//                     "type": "integer",
//                     "example": "23",
//                     "unit": "Number"
//                 },
//                 "type": "int4",
//                 "id": "SETTLEMENT_PERIOD"
//             },
//             {
//                 "info": {
//                     "comment": "N/A",
//                     "description": "This is an estimate forecast of the GB wind generation from wind farms which do not have Transmission System metering installed. These wind farms are embedded in the distribution network and invisible to Nation Grid ESO. Their effect is to suppress the electricity demand during periods of high wind. The true output of these generators is not known so an estimate is provided based on Nation Grid ESO’s best model. ",
//                     "title": "Embedded wind Forecast ",
//                     "type": "integer",
//                     "example": "2361",
//                     "unit": "MW"
//                 },
//                 "type": "int4",
//                 "id": "EMBEDDED_WIND_FORECAST"
//             },
//             {
//                 "info": {
//                     "comment": "N/A",
//                     "description": "This is Nation Grid ESO’s best view of the installed embedded wind capacity in GB. This is based on publically available information compiled from a variety of sources and is not the definitive view. It is consistent with the generation estimate provided. ",
//                     "title": "Embedded Wind Capacity",
//                     "type": "integer",
//                     "example": "6559",
//                     "unit": "MW"
//                 },
//                 "type": "int4",
//                 "id": "EMBEDDED_WIND_CAPACITY"
//             },
//             {
//                 "info": {
//                     "comment": "N/A",
//                     "description": "This is an estimate forecast of the GB solar generation from solar farms which do not have Transmission System metering installed. These solar farms are embedded in the distribution network and invisible to Nation Grid ESO. Their effect is to suppress the electricity demand during periods of high solar periods. The true output of these generators is not known so an estimate is provided based on Nation Grid ESO’s best model.",
//                     "title": "Embedded Solar Forecast",
//                     "type": "integer",
//                     "example": "7406",
//                     "unit": "MW"
//                 },
//                 "type": "int4",
//                 "id": "EMBEDDED_SOLAR_FORECAST"
//             },
//             {
//                 "info": {
//                     "comment": "N/A",
//                     "description": "Estimated Embedded Solar Capacity. This is National Grid ESO’s best view of the installed embedded solar capacity in GB. This is based on publically available information compiled from a variety of sources and is not the definitive view. It is consistent with the generation estimate provided.",
//                     "title": "Embedded Solar Capacity",
//                     "type": "integer",
//                     "example": "13080",
//                     "unit": "MW"
//                 },
//                 "type": "int4",
//                 "id": "EMBEDDED_SOLAR_CAPACITY"
//             }
//         ],
//         "records_format": "objects",
//         "records": [
//             {
//                 "_id": 2,
//                 "DATE_GMT": "2024-01-26T00:00:00",
//                 "TIME_GMT": "12:00",
//                 "SETTLEMENT_DATE": "2024-01-26T00:00:00",
//                 "SETTLEMENT_PERIOD": 24,
//                 "EMBEDDED_WIND_FORECAST": 3984,
//                 "EMBEDDED_WIND_CAPACITY": 6488,
//                 "EMBEDDED_SOLAR_FORECAST": 4678,
//                 "EMBEDDED_SOLAR_CAPACITY": 15905
//             },
//             {
//                 "_id": 3,
//                 "DATE_GMT": "2024-01-26T00:00:00",
//                 "TIME_GMT": "12:30",
//                 "SETTLEMENT_DATE": "2024-01-26T00:00:00",
//                 "SETTLEMENT_PERIOD": 25,
//                 "EMBEDDED_WIND_FORECAST": 3908,
//                 "EMBEDDED_WIND_CAPACITY": 6488,
//                 "EMBEDDED_SOLAR_FORECAST": 4693,
//                 "EMBEDDED_SOLAR_CAPACITY": 15905
//             },
//             {
//                 "_id": 4,
//                 "DATE_GMT": "2024-01-26T00:00:00",
//                 "TIME_GMT": "13:00",
//                 "SETTLEMENT_DATE": "2024-01-26T00:00:00",
//                 "SETTLEMENT_PERIOD": 26,
//                 "EMBEDDED_WIND_FORECAST": 3832,
//                 "EMBEDDED_WIND_CAPACITY": 6488,
//                 "EMBEDDED_SOLAR_FORECAST": 4606,
//                 "EMBEDDED_SOLAR_CAPACITY": 15905
//             }
//         ],
//         "limit": 3,
//         "offset": 1,
//         "_links": {
//             "start": "/api/3/action/datastore_search?resource_id=db6c038f-98af-4570-ab60-24d71ebd0ae5&limit=3",
//             "next": "/api/3/action/datastore_search?resource_id=db6c038f-98af-4570-ab60-24d71ebd0ae5&limit=3&offset=4"
//         },
//         "total": 602
//     }
// }

type RawResponseRecord = {
  _id: number;
  DATE_GMT: string;
  TIME_GMT: string;
  SETTLEMENT_DATE: string;
  SETTLEMENT_PERIOD: number;
  EMBEDDED_WIND_FORECAST: number;
  EMBEDDED_WIND_CAPACITY: number;
  EMBEDDED_SOLAR_FORECAST: number;
  EMBEDDED_SOLAR_CAPACITY: number;
};

type RawResponse = {
  help: string;
  success: boolean;
  result: {
    include_total: boolean;
    resource_id: string;
    fields: {
      type: string;
      id: string;
      info: {
        comment: string;
        description: string;
        title: string;
        type: string;
        example: string;
        unit: string;
      };
    }[];
    records_format: string;
    records: RawResponseRecord[];
    limit: number;
    offset: number;
    _links: {
      start: string;
      next: string;
    };
    total: number;
  };
};

export type EmbeddedForecastValue = {
    capacity: number;
    level: number;
}

export type EmbeddedSolarAndWindRecord = {
  time: string;
  wind: EmbeddedForecastValue
  solar: EmbeddedForecastValue
};

export const parseDate = (r: RawResponseRecord): string => {
  //"DATE_GMT": "2024-01-26T00:00:00",
  //"TIME_GMT": "12:00"
  return new Date(`${r.DATE_GMT.slice(0, 10)}T${r.TIME_GMT}Z`).toISOString();
};

const embeddedSolarAndWindRecord = object({
  time: string().required(),
  wind: object({
    capacity: string().required(),
    level: string().required(),
  }).required(),
  solar: object({
    capacity: string().required(),
    level: string().required(),
  }).required(),
})

export const transformResponse = (
  r: RawResponse
): EmbeddedSolarAndWindRecord[] => {
  const records = r.result.records;
  if (records.length === 0)
    throw new Error("No emnbedded solar/wind forecast records returned");

  const output = records.map((v) => {
    const record = {
      time: parseDate(v),
    wind: {
      capacity: Number(v.EMBEDDED_WIND_CAPACITY),
      level: Number(v.EMBEDDED_WIND_FORECAST),
    },
    solar: {
      capacity: Number(v.EMBEDDED_SOLAR_CAPACITY),
      level: Number(v.EMBEDDED_SOLAR_FORECAST),
    },
    }
    try {
      embeddedSolarAndWindRecord.validateSync(record)
    } catch(e) {
      log.error(e)
      throw new Error("Embedded solar/wind forecast record failed validation")
    }
    return record
  });

  if(output.length == 0) {throw new Error("No embedded solar/wind forecast records returned")}

  
  return output
};
