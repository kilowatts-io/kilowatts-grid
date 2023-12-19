import React from "react";
import { useLocalSearchParams } from "expo-router";
import log from "../services/log";
import { unitGroupsDict } from "../assets/data/units";
import { useNavigation } from "expo-router";


import { UnknownUnitGroupCode } from "../atoms/cards";
import { UnitGroup } from "../common/types";
import { lookups } from "../services/nav";

type WithUnitGroupCodeProps<T> = {
  component: React.ComponentType<{ ug: UnitGroup }>;
};

const WithUnitGroupCode: React.FC<WithUnitGroupCodeProps<UnitGroup>> = ({
  component: Component,
}) => {
  log.debug(`WithUnitGroupCode`)
  const nav = useNavigation();
  const { code } = useLocalSearchParams<{ code: string }>();
  

  React.useEffect(() => {
    if (!code) {
      log.debug(`WithUnitGroupCode: No code found in URL`);
    } else {
      const unitGroup = lookups.unitGroup(code);
      if (!unitGroup) {
        log.debug(`WithUnitGroupCode: No unitGroup found with code ${code}`);
      } else {
        log.debug(
          `WithUnitGroupCode: Found unitGroup ${unitGroup.details.name}`
        );
        nav.setOptions({ title: unitGroup.details.name });
      }
    }
  }, [code]);

  if (!code) {
    return <UnknownUnitGroupCode />;
  }

  const unitGroup = lookups.unitGroup(code);
  if (!unitGroup) {
    log.debug(`WithUnitGroupCode: No unitGroup found with code ${code}`);
    return <UnknownUnitGroupCode />;
  }

  log.info(`WithUnitGroupCode: Rendering ${unitGroup.details.name}`);

  return (
    <>
      <Component ug={unitGroup} />;
    </>
  )
};

export default WithUnitGroupCode;
