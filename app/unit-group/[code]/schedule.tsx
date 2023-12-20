import React, { useContext } from "react";
import { UnitGroupSchedule } from "../../../components/UnitGroupSchedule";
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
    return <UnitGroupSchedule ug={unitGroup} />;
  }
};

export default UnitGroupHistoryScreen;
