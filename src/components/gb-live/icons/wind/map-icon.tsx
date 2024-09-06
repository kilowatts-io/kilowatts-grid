import { WindTurbineBalancingLightMap } from "./visual/balancing-light";
import { WindTurbineBladesMap } from "./visual/blades";
import { WindTurbineMastMap } from "./visual/mast";

type WindMapIconProps = {
  balancing: "bid" | "offer" | "none";
  point: { x: number; y: number };
  sizePx: number;
  cycleSeconds: number | null;
};

export const WindMapIcon: React.FC<WindMapIconProps> = (p) => {
  return (
    <>
      <WindTurbineBalancingLightMap
        balancing={p.balancing}
        point={p.point}
        sizePx={p.sizePx}
      />
      <WindTurbineMastMap point={p.point} sizePx={p.sizePx} />
      <WindTurbineBladesMap
        point={p.point}
        cycleSeconds={p.cycleSeconds}
        sizePx={p.sizePx}
      />
    </>
  );
};
