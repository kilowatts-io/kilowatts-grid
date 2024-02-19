/* eslint-disable react/prop-types */
import { WindTurbineBalancingLightMap } from "./visual/balancing-light";
import { WindTurbineBladesMap } from "./visual/blades";
import { WindTurbineMastMap } from "./visual/mast";

type WindMapIconProps = {
  balancing: "bid" | "offer" | "none";
  point: { x: number; y: number };
  sizePx: number;
  cycleSeconds: number;
};

export const WindMapIcon: React.FC<WindMapIconProps> = ({
  balancing,
  point,
  sizePx,
  cycleSeconds
}) => {
  return (
    <>
      <WindTurbineBalancingLightMap
        balancing={balancing}
        point={point}
        sizePx={sizePx}
      />
      <WindTurbineMastMap
        point={point}
        sizePx={sizePx}
      />
      <WindTurbineBladesMap
        point={point}
        cycleSeconds={cycleSeconds}
        sizePx={sizePx}
      />
    </>
  );
};
