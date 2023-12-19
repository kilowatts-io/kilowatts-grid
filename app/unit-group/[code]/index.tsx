import { useContext } from "react";
import { UnitGroupContext } from "../../../services/contexts";
import log from "../../../services/log";
import { UnitGroupLive } from "../../../components/UnitGroupLive";

export const UnitGroupScreen = () => {
  log.debug("UnitGroupScreen");
  const unitGroup = useContext(UnitGroupContext);
  if (!unitGroup) {
    log.debug("UnitGroupScreen: No unitGroup found in context");
    return null;
  } else {
    log.debug(`UnitGroupScreen: Found unitGroup ${unitGroup.details.name}`);
    return <UnitGroupLive ug={unitGroup} />;
  }
};
export default UnitGroupScreen;
