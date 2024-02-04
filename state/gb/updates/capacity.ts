import { BmUnitMelsSchema } from "../../apis/elexon/mels";
import {
  UnitGroupBmUnits,
  unitGroupBmUnits,
} from "../fixtures/generators/unit-groups";
import { store } from "../../reducer";
import { setUnitGroupCapacity, setUpdatedCapacities } from "../live";
import { log } from "../../../utils/logs";
import { getUnitGroupCapacity } from "../calcs";

const updateUnitGroupCapacity = (
  now: Date,
  data: BmUnitMelsSchema,
  ug: UnitGroupBmUnits
) =>
  store.dispatch(
    setUnitGroupCapacity({
      unitGroupCode: ug.unitGroupCode,
      capacity: getUnitGroupCapacity(now, data, ug),
    })
  );

export const updateCapacity = (now: Date, data: BmUnitMelsSchema) => {
  unitGroupBmUnits.map((ug) => updateUnitGroupCapacity(now, data, ug));
  log.info("updateCapacity complete");
  store.dispatch(setUpdatedCapacities());
};
