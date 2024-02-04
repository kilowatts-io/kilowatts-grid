import { ScaledSize } from "react-native";
import getUsableScreenSize from "./usable-screen-size";
import { GB_SVG_DIMS } from "../path";

/* calculate the most zoomed out scale possible - that when the entire UK is visible on the screen*/
const calculateMinScale = (screen: ScaledSize) => {
  "worklet";
  const usableScreen = getUsableScreenSize(screen);
  const svgHeight = GB_SVG_DIMS.height
  const svgWidth = GB_SVG_DIMS.width
  const scaleHeight = usableScreen.height / svgHeight;
  const scaleWidth = usableScreen.width / svgWidth;
  const scale = Math.min(scaleHeight, scaleWidth);
  return scale;

};

export default calculateMinScale;
