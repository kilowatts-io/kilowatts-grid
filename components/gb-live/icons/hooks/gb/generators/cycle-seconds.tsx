import React from "react";
import { useSharedValue } from "react-native-reanimated";

import { selectors as s } from "../../../../../../state/gb/live";
import { store } from "../../../../../../state/reducer";
import { MapContext } from "../../../../svg-map/context";
import { calculateCycleSeconds } from "../../../calcs";

const useCycleSeconds = (unitGroupCode: string) => {
  const gestureMode = React.useContext(MapContext).gestureMode;
  const cycleSeconds = useSharedValue<null | number>(null);

  React.useEffect(() => {
    const setCycleSeconds = () => {
      if (!gestureMode || gestureMode.value !== "none")
        cycleSeconds.value = null;
      const cf = s.unitGroupCapacityFactor(store.getState(), unitGroupCode);
      const cs = calculateCycleSeconds(cf);
      if (cycleSeconds.value !== cs) cycleSeconds.value = cs;
    };
    setCycleSeconds();
    const sub = store.subscribe(() => setCycleSeconds());
    return () => sub();
  }, [unitGroupCode, gestureMode.value]);

  return cycleSeconds;
};

export default useCycleSeconds;
