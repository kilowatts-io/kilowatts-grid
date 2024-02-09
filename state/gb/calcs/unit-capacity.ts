import { BmUnitMelsSchema } from "../../apis/elexon/mels";
import { getMostRecentMels } from "../../utils";

export const getUnitCapacity = (
  now: Date,
  data: BmUnitMelsSchema,
  bmUnit: string
): number => {
  const unit = data.find((d) => d.bmUnit === bmUnit);
  if (!unit || unit.levels.length === 0) return 0;
  const capacity = getMostRecentMels(now, unit.levels);
  return capacity;
};
