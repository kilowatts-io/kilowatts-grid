import { log } from "../../../utils/logs";
import { store } from "../../reducer";
import { calculateBalancingVolume } from "../calcs";
import { MelsPnBoalfsUpdateFunction } from "../hooks/melsPnBoalfs";
import { setBalancingTotalsBid, setBalancingTotalsOffer } from "../live";

export const updateBalancingTotals: MelsPnBoalfsUpdateFunction = (now, data) => {
  const volumes = data.boalf.map((unitBoalfs) => {
    const bmUnit = unitBoalfs.bmUnit;
    const pn = data.pn.find((pn) => pn.bmUnit === bmUnit);
    const mels = data.mels.find((mels) => mels.bmUnit === bmUnit);
    return calculateBalancingVolume({
      data: { pn: pn.levels, mels: mels.levels, boalf: unitBoalfs.boalfs },
      now,
    });
  });

  const bid = volumes.filter((v) => v < 0).reduce((acc, v) => acc + v, 0);
  const offer = volumes.filter((v) => v > 0).reduce((acc, v) => acc + v, 0);

  store.dispatch(setBalancingTotalsBid(bid));
  store.dispatch(setBalancingTotalsOffer(offer));
  console.info("updateBalancingTotals complete", { bid, offer });
};
