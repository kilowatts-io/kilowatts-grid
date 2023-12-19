import React from "react";
import { UnitGroup } from "../common/types";
import { useUnitGroupLiveQuery } from "../services/state/elexon-insights-api.hooks";
import log from "../services/log";

type UnitGroupLiveProps = {
  ug: UnitGroup;
};
export const UnitGroupLive: React.FC<UnitGroupLiveProps> = ({ ug }) => {
  log.debug(`UnitGroupLive ${ug.details.name}`);
  const { data, isLoading, refetch } = useUnitGroupLiveQuery(ug);
  console.log(data)
  return <></>;
};
