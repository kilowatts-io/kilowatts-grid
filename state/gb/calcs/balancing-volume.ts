import { TransformedBoalfSchema } from "../../apis/elexon/boalf";
import { BasicLevel } from "../../apis/elexon/commonTypes";
import { calculateUnitOutput } from "./unit-output";

export const calculateBalancingVolume =  ({
    data,
    now,
  }: {
    data: {
      pn: BasicLevel[];
      mels: BasicLevel[];
      boalf: TransformedBoalfSchema[];
    };
    now: Date;
  }): number => {
    const currentOutput = calculateUnitOutput({ data, now });
    return currentOutput.postBm.actual - currentOutput.preBm;
  }