// get solar national generation for a particular point in time (normally now)

import { getStartOfCurrentHalfHour } from "../utils";
import { useNationalQuery } from "../apis/sheffield/api";
import { NationalSolarResponse } from "../apis/sheffield/national";

export const add30Minutes = (date: Date) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + 30);
  return result;
};

export const generateQueryParams = (
  date: Date
): { start: string; end: string } => {
  const start = getStartOfCurrentHalfHour(date);
  return {
    start: start.toISOString(),
    end: add30Minutes(start).toISOString(),
  };
};

export type NationalSolarData = {
  output: number;
  capacity: number;
};

const FALLBACK_CAPACITY = 15954.059;

export const readCapacity = (resp: NationalSolarResponse) => {
  if (resp.length === 0) return FALLBACK_CAPACITY;
  return resp[resp.length - 1].capacity;
};

const getValue = (resp: NationalSolarResponse, date: string) => {
  const match = resp.find((x) => x.start === date);
  if (!match) return 0;
  return match.output;
};

const interpolateCurrentSolar = (
  date: Date,
  resp: NationalSolarResponse,
  params: { start: string; end: string }
): NationalSolarData => {

  if (resp.length === 0) {
    return {
      output: 0,
      capacity: 0,
    };
  }
  const start = getValue(resp, params.start);
  const end = getValue(resp, params.end);
  const timeDiff =
    new Date(params.end).getTime() - new Date(params.start).getTime();
  const timeSinceStart = date.getTime() - new Date(params.start).getTime();
  const fraction = timeSinceStart / timeDiff;
  const output = start + (end - start) * fraction;
  return {
    output,
    capacity: readCapacity(resp),
  };
};

type NationalSolarQueryResponse = {
  isError: boolean;
  data: null | NationalSolarData;
  isFetching: boolean;
};

export const useSolarNationalQuery = (
  date: Date
): NationalSolarQueryResponse => {
  const params = generateQueryParams(date);
  const query = useNationalQuery(params, {
    pollingInterval: 1000 * 15,
  });
  if (query.data) {
    try {
      return {
        data: interpolateCurrentSolar(date, query.data, params),
        isError: false,
        isFetching: query.isFetching,
      };
    } catch (e) {
      return {
        data: null,
        isError: true,
        isFetching: query.isFetching,
      };
    }
  } else {
    return {
      data: null,
      isError: false,
      isFetching: query.isFetching,
    };
  }
};
