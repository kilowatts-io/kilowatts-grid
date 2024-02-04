import { store } from "../../../../../../state/reducer";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { selectors as s } from "../../../../../../state/gb/live";
import { Balancing } from "../../../types";
import { MapContext } from "../../../../svg-map/context";

const useBalancing = (unitGroupCode: string) => {
  const {gestureMode} = React.useContext(MapContext);
  const balancing = useSharedValue<Balancing>("none");
  React.useEffect(() => {
    const setBalancing = () => {
      if(!gestureMode || gestureMode.value !== "none") balancing.value = "none"; 
      const d = s.unitGroupBalancingDirection(store.getState(), unitGroupCode);
      if (balancing.value !== d) balancing.value = d;
    };
    setBalancing();
    const sub = store.subscribe(() => setBalancing());
    return () => sub();
  }, [unitGroupCode, gestureMode.value]);
  return balancing;
};

export default useBalancing;
