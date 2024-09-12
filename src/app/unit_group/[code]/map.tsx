import React from "react";
import { LargeScreenRedirect } from "@/src/hooks/screen";
import { UnitGroupMapScreen, useBackUrl } from "@/src/components/unit-group";

const WithSmallScreen = () => {
  const backUrl = useBackUrl();
  return (
    <LargeScreenRedirect redirectUrl={backUrl}>
      <UnitGroupMapScreen />;
    </LargeScreenRedirect>
  );
};

export default WithSmallScreen;
