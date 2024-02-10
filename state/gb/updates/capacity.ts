import { log } from "../../../utils/logs";
import { BmUnitMelsSchema } from "../../apis/elexon/mels";
import { store } from "../../reducer";
import { getUnitGroupCapacity } from "../calcs";
import {
  UnitGroupBmUnits,
  unitGroupBmUnits
} from "../fixtures/generators/unit-groups";
import { setUnitGroupCapacity, setUpdatedCapacities } from "../live";

const updateUnitGroupCapacity = (
  now: Date,
  data: BmUnitMelsSchema,
  ug: UnitGroupBmUnits
) =>
  store.dispatch(
    setUnitGroupCapacity({
      unitGroupCode: ug.unitGroupCode,
      capacity: getUnitGroupCapacity(now, data, ug)
    })
  );

export const updateCapacity = (now: Date, data: BmUnitMelsSchema) => {
  unitGroupBmUnits.map((ug) => updateUnitGroupCapacity(now, data, ug));
  console.info("Updated capacities");
  store.dispatch(setUpdatedCapacities());
};
