import { unitGroupsDict } from "../assets/data/units";
import { UnitGroup } from "../common/types";

type Urls = Record<string, (code: string) => any>;

export const urls: Urls = {
  unitGroup: (code: string) => `/unit-group/${code.toLowerCase()}`,
};

export const lookups = {
  unitGroup: (code: string): UnitGroup | undefined => {
    const ug = unitGroupsDict[code.toUpperCase()];
    return ug ? ug : undefined;
  },
};
