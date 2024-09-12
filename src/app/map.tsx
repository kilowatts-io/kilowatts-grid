import React from "react";
import * as nav from "../utils/nav";
import { HomeMapScreen } from "../components/home";
import { LargeScreenRedirect } from "../hooks/screen";

const WithSmallScreen = () => (
  <LargeScreenRedirect redirectUrl={nav.home}>
    <HomeMapScreen />
  </LargeScreenRedirect>
);

export default WithSmallScreen;
