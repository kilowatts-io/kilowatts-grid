import {
  BmUnitsBoalfsSchema,
  TransformedBoalfSchema
} from "../../apis/elexon/boalf";
import { BasicLevel } from "../../apis/elexon/commonTypes";
import { BmUnitMelsSchema } from "../../apis/elexon/mels";
import { BmUnitPnsSchema } from "../../apis/elexon/pn";
import { CurrentOutput, getMostRecentMels } from "../../utils";

import { evaluateBoalfsLevel } from "./evaluate-boalfs";
import { interpolateLevel } from "./interpolate-level";

export const calculateUnitOutput = ({
  data,
  now
}: {
  data: {
    pn: BasicLevel[];
    mels: BasicLevel[];
    boalf: TransformedBoalfSchema[];
  };
  now: Date;
}): CurrentOutput => {
  const preBm = interpolateLevel(now, data.pn);
  const postBm = evaluateBoalfsLevel(now, preBm, data.boalf);
  const capacity = getMostRecentMels(now, data.mels);

  const output = {
    capacity,
    preBm: preBm.level,
    postBm: {
      actual: postBm.level,
      delta: postBm.delta
    }
  };

  return output;
};

const pnOrEmpty = (bmUnit: string, pn: BmUnitPnsSchema) => {
  const pns = pn.find((d) => d.bmUnit === bmUnit);
  return pns ? pns.levels : [];
};

const boalfOrEmpty = (bmUnit: string, boalf: BmUnitsBoalfsSchema) => {
  const boalfs = boalf.find((d) => d.bmUnit === bmUnit);
  return boalfs ? boalfs.boalfs : [];
};

const melsOrEmpty = (bmUnit: string, mels: BmUnitMelsSchema) => {
  const mel = mels.find((d) => d.bmUnit === bmUnit);
  return mel ? mel.levels : [];
};

export const getUnitOutput = (
  now: Date,
  data: {
    pn: BmUnitPnsSchema;
    mels: BmUnitMelsSchema;
    boalf: BmUnitsBoalfsSchema;
  },
  bmUnit: string
) =>
  calculateUnitOutput({
    data: {
      pn: pnOrEmpty(bmUnit, data.pn),
      mels: melsOrEmpty(bmUnit, data.mels),
      boalf: boalfOrEmpty(bmUnit, data.boalf)
    },
    now
  });
