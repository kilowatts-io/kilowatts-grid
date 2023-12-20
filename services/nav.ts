import { unitGroupsDict } from "../assets/data/units";
import { UnitGroup } from "../common/types";
import log from "../services/log";

type Urls = Record<string, (code: string) => any> | any;

export const urls: Urls = {
  home: "/",
  privacy: '/privacy',
  unitGroup: (code: string) => `/unit-group/${code.toLowerCase()}`,
  elexonLicense: "https://www.elexon.co.uk/data/balancing-mechanism-reporting-agent/copyright-licence-bmrs-data/"
};

export const lookups = {
  unitGroup: (code: string): UnitGroup | undefined => {
    log.debug(`Looking up unit group for code: ${code}`)
    const ug = unitGroupsDict[code.toUpperCase()];
    log.debug(`Found unit group: ${ug}`)
    return ug ? ug : undefined;
  },
};
