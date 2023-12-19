import React from "react";
import log from "../../../services/log";
import WithUnitGroupCode from "../../../components/WithUnitGroupCode";
import { UnitGroupLive } from "../../../components/UnitGroupLive";

type UnitGroupHistoryScreenProps = {};

/*
UnitGroupHistory is a placeholder for the UnitGroupHistory screen.
*/
export const UnitGroupHistoryScreen: React.FC<
  UnitGroupHistoryScreenProps
> = () => {
  log.info("UnitGroupHistoryScreen");
  return(
    <WithUnitGroupCode component={UnitGroupLive} />
  )
};

export default UnitGroupHistoryScreen