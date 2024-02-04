import { store } from "../../../../../../state/reducer";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { selectors as s } from "../../../../../../state/gb/live";
import { calculateSizePx } from "../../../calcs";

const useSizePx = (unitGroupCode: string) => {
  const sizePx = useSharedValue(0);
  React.useEffect(() => {
    const setSizePx = () => {
      const c = s.unitGroupCapacity(store.getState(), unitGroupCode);
      const size = calculateSizePx(c);
      if (sizePx.value !== size) sizePx.value = size;
    };
    setSizePx();
    const sub = store.subscribe(() => setSizePx());
    return () => sub();
  }, [unitGroupCode]);
  return sizePx;
};

export default useSizePx;
