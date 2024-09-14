import { Redirect } from "expo-router";
import React from "react";
import { useWindowDimensions } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

export const NARROW_SCREEEN_WIDTH_BREAKPOINT = 700;

export const LEFT_WIDTH = 300;

export const TOP_BOTTOM_PADDING = 50;
export const LEFT_RIGHT_PADDING = 5;

export const useScreen = () => {
  const dims = useWindowDimensions();
  const width = useSharedValue(dims.width);
  
  React.useEffect(() => {
    if(dims.width !== width.value) width.value = dims.width;
  }, [dims.width]);

  const smallScreen = useDerivedValue(
    () => width.value < NARROW_SCREEEN_WIDTH_BREAKPOINT,
    [width, dims]
  );
  const mapWidth = useDerivedValue(
    () => (smallScreen.value ? width.value : width.value - LEFT_WIDTH),
    [width, smallScreen]
  );
  const mapHeight = useDerivedValue(
    () => dims.height - TOP_BOTTOM_PADDING,
    [dims.height]
  );
  return {
    smallScreen,
    mapWidth,
    mapHeight,
  };
};

export const LargeScreenRedirect: React.FC<{
  children: React.ReactNode;
  redirectUrl: string;
}> = ({ children, redirectUrl }) => {
  const { smallScreen } = useScreen();
  if (!smallScreen.value) {
    return <Redirect href={redirectUrl} />;
  }
  return <>{children}</>;
};
