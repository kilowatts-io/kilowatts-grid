import { InferType, array, object, string, number } from "yup";

type QueryParams = {
  start: string;
  end: string;
};

const YYMMHHMM_LENGTH = 16;

export const sliceIsoDate = (iso: string) => iso.slice(0, YYMMHHMM_LENGTH);

export const query = ({ start, end }: QueryParams): string => {
  const path = `/gsp/0?start=${sliceIsoDate(start)}&end=${sliceIsoDate(
    end
  )}&extra_fields=installedcapacity_mwp`;
  return path;
};

const rawResponse = object({
  data: array(array()).required(),
  meta: array(string()).required(),
});

type RawResponse = InferType<typeof rawResponse>;

const solarValueSchema = object({
  start: string().required(),
  capacity: number().required(),
  output: number().required(),
}).required();

export type NationalSolarResponse = {
  start: string;
  capacity: number;
  output: number;
}[];

export const transformResponse = (raw: RawResponse): NationalSolarResponse => {
  rawResponse.validateSync(raw);
  let output: NationalSolarResponse = [];
  for (const row of raw.data) {
    const solarValue = {
      start: row[1],
      capacity: row[3],
      output: row[2],
    };
    solarValueSchema.validateSync(solarValue);
    output.push(solarValue);
  }
  if (output.length > 2) {
    throw new Error("More than two rows returned");
  }
  const sorted = output.sort((a, b) => (a.start < b.start ? -1 : 1));
  return sorted
};
