import React from "react";
import SmallLargeScreen from "../components/small-large-screen";
import { SmallHomeScreen, LargeHomeScreen } from "../components/home";


export default () => (
  <SmallLargeScreen small={SmallHomeScreen} large={LargeHomeScreen} />
);
