import Papa from "papaparse";

/*parse csv recevived from national grid, and remove last line */
export const parseCSV = (text: string) => {
  const json = Papa.parse(text, { header: true }).data;
  json.pop();
  return json;
};
