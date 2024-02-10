import { BmUnitMelsSchema } from "../../apis/elexon/mels";
import { UnitGroupBmUnits } from "../fixtures/generators/unit-groups";

import { getUnitCapacity } from "./unit-capacity";

export const getUnitGroupCapacity = (
  now: Date,
  data: BmUnitMelsSchema,
  ug: UnitGroupBmUnits
): number =>
  ug.bmUnits
    .map((bmUnit) => getUnitCapacity(now, data, bmUnit))
    .reduce((acc, v) => acc + v, 0);
