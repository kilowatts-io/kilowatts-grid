import { useEmbeddedSolarAndWindQuery } from "../../apis/nationalGridEso/api";
import { EmbeddedSolarAndWindRecord } from "../../apis/nationalGridEso/embeddedSolarAndWind";
import React from "react";
import { updateEmbeddedForecast } from "../updates/embedded-forecast";
import { useNowQuery } from "./now";
import { log } from "../../../utils/logs";
import { interpolateLevel } from "../calcs";
import { CurrentOutput } from "../../utils";

interface InterpolatedEmbeddedForecast {
  wind: {
    capacity: number;
    level: number;
    delta: number;
  };
  solar: {
    capacity: number;
    level: number;
    delta: number;
  };
}

export const interpolateValue = (
  now: Date,
  values: EmbeddedSolarAndWindRecord[]
): InterpolatedEmbeddedForecast | null => {
  if(!values) return null  
  if (values.length === 0) return null;

  const first = values[0];

  if (new Date(first.time) >= now) {
    return {
      solar: {
        capacity: first.solar.capacity,
        level: first.solar.level,
        delta: 0,
      },
      wind: {
        capacity: first.wind.capacity,
        level: first.wind.level,
        delta: 0,
      },
    };
  }  

  return {
    solar: {
      capacity: first.solar.capacity,
      ...interpolateLevel(
        now,
        values.map((x) => ({
          level: x.solar.level,
          time: x.time,
        }))
      ),
    },
    wind: {
      capacity: first.wind.capacity,
      ...interpolateLevel(
        now,
        values.map((x) => ({
          level: x.wind.level,
          time: x.time,
        }))
      ),
    },
  };
};

export type EmbeddedData = { solar: CurrentOutput; wind: CurrentOutput };

export interface EmbeddedForecastResult {
  data: null | EmbeddedData;
  isFetching: boolean;
  isError: boolean;
}

export const useEmbeddedForecasts = () => {
  const now = useNowQuery();
  const query = useEmbeddedSolarAndWindQuery(undefined, {
    pollingInterval: 1000 * 60 * 15,
  });
  React.useEffect(() => {
    try {
      const result = interpolateValue(now.now, query.data);
      updateEmbeddedForecast(result);
    } catch(e) {
      console.warn(e)
    }
  }, [now.now, query.data]);
  return {refetch: query.refetch}
};
