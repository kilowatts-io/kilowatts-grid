import { ScaledSize } from "react-native";
import { ZoomPanSharedValueState } from "../context";
import calculateMinScale from "./min-scale";
import calculateSvgDims from "./svg-dims";

/* 
determine the correct initial zoom/pan state for the screen
1. scale the map to center the screen, after applying a bias to the initial translation in both x and y
2. set the initial zoom level as ratio of the screen size to the map size
*/
const getInitialZoomPanSharedValueState = (
  screen: ScaledSize
): ZoomPanSharedValueState => {
  const scale = calculateMinScale(screen);
  const svgDims = calculateSvgDims(scale);
  // calculate any difference between the screen size and the scaled map size
  const widthDiff = screen.width - svgDims.width;
  // halve the difference to center the map
  const translateX = widthDiff / 2;
  const translateY = 0;
  const zoomPan = { translateX, translateY, scale };
  return zoomPan;
};

export default getInitialZoomPanSharedValueState;
