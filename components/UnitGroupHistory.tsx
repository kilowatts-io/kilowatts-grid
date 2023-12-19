import React from "react";
import { UnitGroup } from "../common/types";
import log from "../services/log";
import { useUnitGroupHistoryQuery } from "../services/state/elexon-insights-api.hooks";

type UnitGroupHistoryProps = {
  ug: UnitGroup;
};

export const UnitGroupHistory: React.FC<UnitGroupHistoryProps> = ({ ug }) => {
  log.info(`UnitGroupHistory ${ug.details}`);
  const query = useUnitGroupHistoryQuery(ug)
  console.log(query.data)
  return (
    <>
    </>
  );
};
