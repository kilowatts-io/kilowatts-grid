import React from "react";
import { useScreen } from "../hooks/screen";

const SmallLargeScreen: React.FC<{
  small: React.FC;
  large: React.FC;
}> = (p) => {
  const smallScreen = useScreen().smallScreen.value;
  return smallScreen ? <p.small /> : <p.large />;
};

export default SmallLargeScreen;
