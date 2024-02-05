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
import { AppState } from "react-native";

export type MelsPnBoalfsData = {
  pn: BmUnitPnsSchema;
  mels: BmUnitMelsSchema;
  boalf: BmUnitsBoalfsSchema;
};

export type MelsPnBoalfsUpdateFunction = (
  now: Date,
  data: MelsPnBoalfsData
) => void;

const UPDATE_FUNCTIONS: MelsPnBoalfsUpdateFunction[] = [
  updateUnitGroupsOutput,
  updateBalancingTotals,
  updateOutputTotalsInterconnectors,
  updateOutputTotalsGenerators,
];

const POLLING_INTERVAL = 1000 * 60 * 10;

export const useMelsPnBoalfs = () => {
  const now = useNowQuery();
  const pn = usePnQuery(now.args.settlementPeriod, {
    pollingInterval: POLLING_INTERVAL,
  });
  const boalf = useBoalfQuery(now.args.fromTo, {
    pollingInterval: POLLING_INTERVAL,
  });
  const mels = useMelsQuery(now.args.fromTo, {
    pollingInterval: POLLING_INTERVAL,
  });

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

  // trigger refetch on app resume to get fresh data
  React.useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        pn.refetch();
        boalf.refetch();
        mels.refetch();
      }

    };
    const listener = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      listener.remove();
    };
  }, []);
};
