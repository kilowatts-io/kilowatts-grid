import { ScaledSize } from "react-native";

import { SCREEN_MARGIN_PIXELS } from "../constants";

const getUsableScreenSize = (screen: ScaledSize) => {
  "worklet";
  const width = screen.width - SCREEN_MARGIN_PIXELS;
  const height = screen.height - SCREEN_MARGIN_PIXELS;
  return { width, height };
};

export default getUsableScreenSize;
