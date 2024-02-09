import React from "react";
import { useDerivedValue } from "react-native-reanimated";

import { filterUnitsByType } from "../../../../../state/gb/fixtures/generators/unit-groups";
import { ErrorBoundaryBlank } from "../../../error-boundary";
import calculatePoint from "../../../svg-map/calcs/point";
import { MapContext } from "../../../svg-map/context";
import { BalancingDirectionLightMap } from "../../balancing-direction-light/map-icon";
import {
  useGbBalancing,
  useGbCapacityFactor,
  useGbCycleSeconds,
  useGbSizePx
} from "../../hooks/gb/generators";
import { BatteryMapIcon } from "../map-icon";

type GbBatteryMapIconProps = {
  key: string;
  unitGroupCode: string;
  point: { x: number; y: number };
};

const BALANCING_DIRECTION_LIGHT_R = 0.5;

const GbBatteryMapIcon: React.FC<GbBatteryMapIconProps> = ({
  unitGroupCode,
  point
}) => {
  const { zoomPan } = React.useContext(MapContext);
  const maxSizePx = useGbSizePx(unitGroupCode);
  const capacityFactor = useGbCapacityFactor(unitGroupCode);
  const cycleSeconds = useGbCycleSeconds(unitGroupCode);
  const balancing = useGbBalancing(unitGroupCode);
  const balancingR = useDerivedValue(() => {
    return (
      (maxSizePx.value / zoomPan.value.scale) * BALANCING_DIRECTION_LIGHT_R
    );
  }, [maxSizePx, zoomPan]);
  return (
    <>
      <BatteryMapIcon
        point={point}
        maxSizePx={maxSizePx}
        capacityFactor={capacityFactor}
        cycleSeconds={cycleSeconds}
      />

      <BalancingDirectionLightMap
        center={point}
        r={balancingR}
        balancing={balancing}
      />
    </>
  );
};

const GbBatteryMapIcons = filterUnitsByType("battery").map((b, i) => (
  <ErrorBoundaryBlank key={`error-boundary-${b.details.code}`}>
    <GbBatteryMapIcon
      key={`gb-battery-map-icon-${i}`}
      unitGroupCode={b.details.code}
      point={calculatePoint(b.details.coords)}
    />
  </ErrorBoundaryBlank>
));

export default GbBatteryMapIcons;
