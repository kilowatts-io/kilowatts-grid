import { ScaledSize } from "react-native";
import { GB_SVG_DIMS } from "../path";
import * as c from "@/src/constants";

const getUsableScreenSize = (screen: ScaledSize) => {
  "worklet";
  const width = screen.width - c.SCREEN_MARGIN_PIXELS;
  const height = screen.height - c.SCREEN_MARGIN_PIXELS;
  return { width, height };
};

/* calculate the most zoomed out scale possible - that when the entire UK is visible on the screen*/
const calculateMinScale = (screen: ScaledSize) => {
  "worklet";
  const usableScreen = getUsableScreenSize(screen);
  const svgHeight = GB_SVG_DIMS.height;
  const svgWidth = GB_SVG_DIMS.width;
  const scaleHeight = usableScreen.height / svgHeight;
  const scaleWidth = usableScreen.width / svgWidth;
  const scale = Math.min(scaleHeight, scaleWidth);
  return scale;
};

export default calculateMinScale;
