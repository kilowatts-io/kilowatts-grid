import { ScaledSize } from "react-native";
import { SCREEN_MARGIN_PIXELS } from "../constants";
import { MAP_BOTTOM_BUTTON_HEIGHT } from "../../constants";

const getUsableScreenSize = (screen: ScaledSize) => {
    "worklet";
    const width = screen.width - SCREEN_MARGIN_PIXELS;
    const height = screen.height - SCREEN_MARGIN_PIXELS - MAP_BOTTOM_BUTTON_HEIGHT;
    return {width, height}
  };

export default getUsableScreenSize;