import * as t from "../../common/types";
import * as p from "../../common/parsers";
import log from "../log";

export const queries = {
  pnAll: (
    r: t.ElexonInsightsPnResponseRaw
  ): t.ElexonInsightsPnResponseParsed => {
    log.debug(`pnAll: ${r.data.length} records found.. transformResponse`);
    if (r.data.length === 0) {
      throw new Error(`pnAll: not available`);
    }
    let output: t.ElexonInsightsPnResponseParsed = {};
    for (const bmUnit of p.getBmUnits(r.data)) {
      output[bmUnit] = p.intervalRecordToLevelPairs(
        r.data.filter((x) => x.bmUnit === bmUnit)
      );
    }
    log.debug(
      `pnAll: transformResponse complete for ${
        Object.keys(output).length
      } units`
    );
    return output;
  },
};
