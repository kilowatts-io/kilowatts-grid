import React, { useContext } from "react";
import { UnitGroupHistory } from "../../../components/UnitGroupHistory";
import { UnitGroupContext } from "../../../services/contexts";
import log from "../../../services/log";

type UnitGroupHistoryScreenProps = {};

/*
UnitGroupHistory is a placeholder for the UnitGroupHistory screen.

*/
export const UnitGroupHistoryScreen: React.FC<
  UnitGroupHistoryScreenProps
> = () => {
  log.debug("UnitGroupHistoryScreen");
  const unitGroup = useContext(UnitGroupContext);
  if (!unitGroup) {
    log.debug("UnitGroupHistoryScreen: No unitGroup found in context");
  } else {
    log.debug(
      `UnitGroupHistoryScreen: Found unitGroup ${unitGroup.details.name}`
    );
    return <UnitGroupHistory ug={unitGroup} />;
  }
};

export default UnitGroupHistoryScreen;
