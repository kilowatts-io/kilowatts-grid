import { useDerivedValue } from "react-native-reanimated";
import { MapContextState } from "./context";

export const useTransformD = (context: MapContextState) => useDerivedValue(() => {
  if(!context || !context.zoomPan) return []
  return [
    { translateX: context.zoomPan.value.translateX },
    { translateY: context.zoomPan.value.translateY },
    { scale: context.zoomPan.value.scale },
  ]
});
  