import { selectors as s } from "../../../../../../state/gb/live";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { store } from "../../../../../../state/reducer";

const useCapacityFactor = (unitGroupCode: string) => {
  const capacityFactor = useSharedValue<number>(0);

  React.useEffect(() => {
    const setCapacityFactor = () => {
      const cf = s.unitGroupCapacityFactor(store.getState(), unitGroupCode);
      if (capacityFactor.value !== cf) capacityFactor.value = cf;
    };
    setCapacityFactor();
    const sub = store.subscribe(() => setCapacityFactor());
    return () => sub();
  }, [unitGroupCode]);

  return capacityFactor;
};

export default useCapacityFactor;
