import React from "react";
import {
  FuelType,
  filterUnitsByType,
} from "../../../../../../state/gb/fixtures/generators/unit-groups";
import {
  useGbBalancing,
  useGbCapacityFactor,
  useGbCycleSeconds,
  useGbSizePx,
} from "../../../hooks/gb/generators";
import calculatePoint from "../../../../svg-map/calcs/point";
import {
  DispatchableIconBalancingLightMap,
  DispatchableIconMap,
} from "../../map-icon";
import { DISPATCHABLE_ICON_COLOURS } from "../../constants";

type GbDispatchableTurbineWheelProps = {
  unitGroupCode: string;
  point: { x: number; y: number };
  color: string;
};
const GbDispatchableTurbineWheel: React.FC<GbDispatchableTurbineWheelProps> = ({
  unitGroupCode,
  point,
  color,
}) => {
  const sizePx = useGbSizePx(unitGroupCode);
  const cycleSeconds = useGbCycleSeconds(unitGroupCode);
  const capacityFactor = useGbCapacityFactor(unitGroupCode);
  return (
    <DispatchableIconMap
      maxSizePx={sizePx}
      capacityFactor={capacityFactor}
      point={point}
      backgroundColor={color}
      cycleSeconds={cycleSeconds}
    />
  );
};

type GbDispatchableBalancingDirectionLightProps = {
  unitGroupCode: string;
  point: { x: number; y: number };
};
const GbDispatchableBalancingDirectionLight: React.FC<
  GbDispatchableBalancingDirectionLightProps
> = ({ point, unitGroupCode }) => {
  const balancing = useGbBalancing(unitGroupCode);
  const sizePx = useGbSizePx(unitGroupCode);
  return (
    <DispatchableIconBalancingLightMap
      balancing={balancing}
      point={point}
      maxSizePx={sizePx}
    />
  );
};

type GbDispatchableMapIconProps = {
  key: string;
  unitGroupCode: string;
  point: { x: number; y: number };
  color: string;
};

const GbDispatchableMapIcon: React.FC<GbDispatchableMapIconProps> = ({
  unitGroupCode,
  point,
  color,
}) => {
  return (
    <>
      <GbDispatchableTurbineWheel
        unitGroupCode={unitGroupCode}
        color={color}
        point={point}
      />
      <GbDispatchableBalancingDirectionLight
        unitGroupCode={unitGroupCode}
        point={point}
      />
    </>
  );
};

const generateGbDispatchableMapIcons = (fuelType: FuelType) =>
  filterUnitsByType(fuelType).map((ug) => (
    <GbDispatchableMapIcon
      key={ug.details.code}
      unitGroupCode={ug.details.code}
      point={calculatePoint(ug.details.coords)}
      color={DISPATCHABLE_ICON_COLOURS[fuelType]}
    />
  ));

export const GbGasMapIcons = generateGbDispatchableMapIcons("gas");
export const GbOilMapIcons = generateGbDispatchableMapIcons("oil");
export const GbCoalMapIcons = generateGbDispatchableMapIcons("coal");
export const GbNuclearMapIcons = generateGbDispatchableMapIcons("nuclear");
export const GbHydroMapIcons = generateGbDispatchableMapIcons("hydro");
export const GbBiomassMapIcons = generateGbDispatchableMapIcons("biomass");

export const GbDispatchableMapIcons = [
  ...GbGasMapIcons,
  ...GbOilMapIcons,
  ...GbCoalMapIcons,
  ...GbNuclearMapIcons,
  ...GbHydroMapIcons,
  ...GbBiomassMapIcons,
];
