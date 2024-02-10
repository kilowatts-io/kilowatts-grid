import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { useSelector } from "react-redux";

import { RootState, store } from "../reducer";

import { selectors } from "./live";

const getBalancingDirection = (volume: number) => {
  if (volume === 0) return "none";
  if (volume > 0) return "offer";
  return "bid";
};

export const useGbBalancingDirectionSharedValue = (unitGroupCode: string) => {
  const balancing = useSharedValue<"none" | "bid" | "offer">("none");
  React.useEffect(() => {
    const setBalancing = () => {
      const b =
        store.getState().gbLiveSlice.unitGroups.balancingVolume[unitGroupCode];
      const direction = getBalancingDirection(b);
      if (balancing.value !== direction) {
        balancing.value = direction;
      }
    };
    setBalancing();
    const sub = store.subscribe(() => setBalancing());
    return () => sub();
  }, [unitGroupCode]);
  return balancing;
};

export const useGbCapacitySharedValue = (unitGroupCode: string) => {
  const selector = (state: RootState) =>
    selectors.unitGroupCapacity(state, unitGroupCode);
  return useSharedValue(useSelector(selector));
};

export const useGbCapacityFactorSharedValue = (unitGroupCode: string) => {
  const capacityFactor = useSharedValue<number>(0);
  React.useEffect(() => {
    const setCapacityFactor = () => {
      const output =
        store.getState().gbLiveSlice.unitGroups.currentOutput[unitGroupCode];
      const capacity =
        store.getState().gbLiveSlice.unitGroups.capacity[unitGroupCode];
      if (!output || !capacity) return;
      const impliedCapacityFactor = output.level / capacity;
      const correctedCapacityFactor = Math.max(
        0,
        Math.min(1, impliedCapacityFactor)
      );
      if (capacityFactor.value !== correctedCapacityFactor) {
        capacityFactor.value = correctedCapacityFactor;
      }
    };
    setCapacityFactor();
    const sub = store.subscribe(() => setCapacityFactor());
    return () => sub();
  }, [unitGroupCode]);

  return capacityFactor;
};

const WIND_CAPACITY_TO_MAX_SIZE_PX_RATIO = 0.02;

export const useMaxSizePxSharedValue = (unitGroupCode: string) => {
  const maxSizePx = useSharedValue<number>(0);

  React.useEffect(() => {
    const setMaxSizePx = () => {
      const c = store.getState().gbLiveSlice.unitGroups.capacity[unitGroupCode];
      if (!c) return;
      const impliedMaxSizePx = c * WIND_CAPACITY_TO_MAX_SIZE_PX_RATIO;
      if (maxSizePx.value !== impliedMaxSizePx)
        maxSizePx.value = impliedMaxSizePx;
    };
    setMaxSizePx();
    const sub = store.subscribe(() => setMaxSizePx());
    return () => sub();
  }, [unitGroupCode]);

  return maxSizePx;
};

const CYCLE_SECONDS_AT_MAX_CAPACITY = 2;

export const roundCapacityFactor = (capacityFactor: number) => {
  if (capacityFactor < 0.25) return 0;
  if (capacityFactor < 0.5) return 0.25;
  if (capacityFactor < 0.75) return 0.5;
  return 1;
};

export const useGbCycleSecondsSharedValue = (unitGroupCode: string) => {
  const cycleSeconds = useSharedValue<undefined | number>(undefined);
  React.useEffect(() => {
    const setCycleSeconds = () => {
      const output =
        store.getState().gbLiveSlice.unitGroups.currentOutput[unitGroupCode]
          .level;
      const capacity =
        store.getState().gbLiveSlice.unitGroups.capacity[unitGroupCode];
      if (!output || !capacity) return;
      const capacityFactor = roundCapacityFactor(output / capacity);
      const impliedCycleSeconds =
        CYCLE_SECONDS_AT_MAX_CAPACITY * capacityFactor;
      if (cycleSeconds.value !== impliedCycleSeconds) {
        cycleSeconds.value = impliedCycleSeconds;
      }
    };
    setCycleSeconds();
    const sub = store.subscribe(() => setCycleSeconds());
    return () => sub();
  }, [unitGroupCode]);
  return cycleSeconds;
};
