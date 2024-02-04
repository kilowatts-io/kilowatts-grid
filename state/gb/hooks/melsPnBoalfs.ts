import { log } from "../../../utils/logs";
import { useMelsQuery, useBoalfQuery, usePnQuery } from "../../apis/elexon/api";
import { BmUnitsBoalfsSchema } from "../../apis/elexon/boalf";
import { BmUnitMelsSchema } from "../../apis/elexon/mels";
import { BmUnitPnsSchema } from "../../apis/elexon/pn";
import { updateBalancingTotals } from "../updates/balancing-totals";
import { updateUnitGroupsOutput } from "../updates/output";
import { updateOutputTotalsGenerators } from "../updates/output-totals-generators";
import { updateOutputTotalsInterconnectors } from "../updates/output-totals-interconnectors";
import { useNowQuery } from "./now";
import React from "react";

export type MelsPnBoalfsData = {
  pn: BmUnitPnsSchema;
  mels: BmUnitMelsSchema;
  boalf: BmUnitsBoalfsSchema;
}

export type MelsPnBoalfsUpdateFunction = (
  now: Date,
  data: MelsPnBoalfsData,
) => void;

const UPDATE_FUNCTIONS: MelsPnBoalfsUpdateFunction[] = [
  updateUnitGroupsOutput,
  updateBalancingTotals,
  updateOutputTotalsInterconnectors,
  updateOutputTotalsGenerators,
];

export const useMelsPnBoalfs = () => {
  log.info("useMelsPnBoalfs");
  const now = useNowQuery();
  const pn = usePnQuery(now.args.settlementPeriod);
  const boalf = useBoalfQuery(now.args.fromTo, {
    pollingInterval: 1000 * 60 * 15,
  });
  const mels = useMelsQuery(now.args.fromTo);

  React.useEffect(() => {
    if (pn.data && boalf.data && mels.data) {
      const data = { pn: pn.data, boalf: boalf.data, mels: mels.data };
      try {
        UPDATE_FUNCTIONS.forEach((fn) => fn(now.now, data));
      } catch (e) {
        console.warn(e);
      }
    }
  }, [now.now, pn.data, boalf.data, mels.data]);
};
