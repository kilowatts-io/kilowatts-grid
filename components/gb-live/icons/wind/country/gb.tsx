import React from "react";

import { filterUnitsByType } from "../../../../../state/gb/fixtures/generators/unit-groups";
import { ErrorBoundaryBlank } from "../../../error-boundary";
import calculatePoint from "../../../svg-map/calcs/point";
import {
  useGbBalancing,
  useGbCycleSeconds,
  useGbSizePx
} from "../../hooks/gb/generators";
import { WindTurbineBalancingLightMap } from "../visual/balancing-light";
import { WindTurbineBladesList, WindTurbineBladesMap } from "../visual/blades";
import { WindTurbineMastList, WindTurbineMastMap } from "../visual/mast";

type GbWindProps = {
  point: { x: number; y: number };
  unitGroupCode: string;
};

export const GbWindBalancingDirectionLight: React.FC<GbWindProps> = ({
  unitGroupCode,
  point
}) => {
  const sizePx = useGbSizePx(unitGroupCode);
  const balancing = useGbBalancing(unitGroupCode);
  return (
    <WindTurbineBalancingLightMap
      balancing={balancing}
      point={point}
      sizePx={sizePx}
    />
  );
};

export const GbWindMast: React.FC<GbWindProps> = ({ unitGroupCode, point }) => {
  const sizePx = useGbSizePx(unitGroupCode);
  return (
    <WindTurbineMastMap
      point={point}
      sizePx={sizePx}
    />
  );
};

export const GbWindBlades: React.FC<GbWindProps> = ({
  unitGroupCode,
  point
}) => {
  const cycleSeconds = useGbCycleSeconds(unitGroupCode);
  const sizePx = useGbSizePx(unitGroupCode);
  return (
    <WindTurbineBladesMap
      point={point}
      cycleSeconds={cycleSeconds}
      sizePx={sizePx}
    />
  );
};

// map icon - combines

export const GbWindMapIcon: React.FC<GbWindProps> = ({
  unitGroupCode,
  point
}) => (
  <>
    <GbWindBalancingDirectionLight
      unitGroupCode={unitGroupCode}
      point={point}
    />
    <GbWindMast
      unitGroupCode={unitGroupCode}
      point={point}
    />
    <GbWindBlades
      unitGroupCode={unitGroupCode}
      point={point}
    />
  </>
);

export const GbWindMapIcons = filterUnitsByType("wind").map((x) => (
  <GbWindMapIcon
    key={`${x.details.code}-wind-map-icon`}
    unitGroupCode={x.details.code}
    point={calculatePoint(x.details.coords)}
  />
));

// list icon

type GbWindMapListIconProps = {
  cycleSeconds: number;
};

export const GbWindMapListIcon: React.FC<GbWindMapListIconProps> = (p) => (
  <ErrorBoundaryBlank>
    <>
      <WindTurbineMastList />
      <WindTurbineBladesList cycleSeconds={p.cycleSeconds} />
    </>
  </ErrorBoundaryBlank>
);
