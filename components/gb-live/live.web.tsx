import React from "react";
import { GbLiveBottomSheetTabs } from "./bottom-sheet-tabs/tabs";
import { WithTermsAndConditionsAccepted } from "./terms-and-conditions/acceptance";
import { useGbLive } from "../../state/gb/hooks";

export const GbLive = () => {
  useGbLive()
  return (
    <WithTermsAndConditionsAccepted>
      <GbLiveBottomSheetTabs />
    </WithTermsAndConditionsAccepted>
  );
}
