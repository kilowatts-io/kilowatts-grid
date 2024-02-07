import { useDispatch, useSelector } from "react-redux";
import { useMelsQuery, useBoalfQuery, usePnQuery } from "../../apis/elexon/api";
import { BmUnitsBoalfsSchema } from "../../apis/elexon/boalf";
import { BmUnitMelsSchema } from "../../apis/elexon/mels";
import { BmUnitPnsSchema } from "../../apis/elexon/pn";
import { updateBalancingTotals } from "../updates/balancing-totals";
import { updateCapacity } from "../updates/capacity";
import { updateUnitGroupsOutput } from "../updates/output";
import { updateOutputTotalsGenerators } from "../updates/output-totals-generators";
import { updateOutputTotalsInterconnectors } from "../updates/output-totals-interconnectors";
import { useNowQuery } from "./now";
import React from "react";
import { useRefresh } from "./appstate";
import { selectors } from "../live";
import { RootState } from "../../reducer";

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

const POLLING_INTERVAL = 1000 * 20;

export const useMelsPnBoalfs = () => {
  const initialLoadComplete = useSelector((state: RootState) =>
    selectors.initialLoadComplete(state)
  );
  const initiated = new Date();
  // const dispatch = useDispatch()

  const now = useNowQuery();
  const pn = usePnQuery(now.args.settlementPeriod, {
    pollingInterval: POLLING_INTERVAL,
    refetchOnReconnect: true,
  });
  const boalf = useBoalfQuery(now.args.fromTo, {
    pollingInterval: POLLING_INTERVAL,
    refetchOnReconnect: true,
  });
  const mels = useMelsQuery(now.args.fromTo, {
    pollingInterval: POLLING_INTERVAL,
    refetchOnReconnect: true,
  });

  // refetch all data every 3 seconds if not initialLoadComplete
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!initialLoadComplete) {
        console.log(
          "refetching data every 3 seconds until initialLoadComplete is true"
        );
        pn.refetch();
        boalf.refetch();
        mels.refetch();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [initialLoadComplete]);

  React.useEffect(() => {
    if (mels.data) {
      try {
        updateCapacity(now.now, mels.data);
      } catch (e) {
        console.warn(e);
      }
    }
  }, [mels.data, now.now]);

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

  useRefresh(() => {
    pn.refetch();
    boalf.refetch();
    mels.refetch();
  });
};
