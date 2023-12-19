import { unitGroupsDict } from "../assets/data/units";
import { UnitGroup } from "../common/types";
import log from "../services/log";

type Urls = Record<string, (code: string) => any>;

export const urls: Urls = {
  unitGroup: (code: string) => `/unit-group/${code.toLowerCase()}`,
};

export const lookups = {
  unitGroup: (code: string): UnitGroup | undefined => {
    log.debug(`Looking up unit group for code: ${code}`)
    const ug = unitGroupsDict[code.toUpperCase()];
    log.debug(`Found unit group: ${ug}`)
    return ug ? ug : undefined;
  },
};
