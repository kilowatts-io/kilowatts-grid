import { useDataContext } from "../contexts/data";
import { useAppSelector } from "../state";

// main home screen

export const useHome = () => {
  const fuel_type = useAppSelector((state) => state.search.fuelType);
  const { data } = useDataContext();
  return {
    map: fuel_type
      ? {
        foreign_markets: [],
        unit_groups: rescaleMapIcons(data.map.unit_groups.filter(
          (x) => x.fuel_type.toLowerCase() === fuel_type.toLowerCase()
        )),
      }as AppMapData
      : data.map,
    fuel_types: data.lists.fuel_types,
  };
};

// fuel type screen

const filterFuelType = (x: { fuel_type: FuelType }, f: FuelType) =>
  x.fuel_type.toLowerCase() === f.toLowerCase();

const smallestIcon = (map_icons: MapGeneratorIconProps[]) =>  {
  const smallest =  map_icons.map(x => x.sizePx).filter(x => x > 0).reduce((a, b) => Math.min(a, b), Infinity)
  return smallest
}

const SMALLEST_ICON_SIZE = 15

const rescaleMapIcons = (map_icons: MapGeneratorIconProps[]) => {
  return map_icons.map((x) => {
    const rescaled = {
      ...x,
      sizePx: Math.max(SMALLEST_ICON_SIZE, x.sizePx),
    }
    return rescaled
  });
}


export const useFuelType = (fuel_type: FuelType) => {
  const { data } = useDataContext();
  const map_icons = rescaleMapIcons(data.map.unit_groups.filter((x) => filterFuelType(x, fuel_type)))
  return {
    map_icons,
    list_data: data.lists.unit_groups.filter((x) =>
      filterFuelType(x, fuel_type)
    ),
  };
};

// unit group screen

export const useUnitGroup = (code: string) => {
  const { data } = useDataContext();
  const map_icon = data.map.unit_groups.find(
    (x) => x.code.toLowerCase() === code.toLowerCase()
  );
  const list_data = data.lists.unit_groups.find(
    (x) => x.code.toLowerCase() === code.toLowerCase()
  );
  if (!map_icon || !list_data) return null;
  return { map_icon, list_data };
};

// embedded resiual

export const useEmbeddedTotals = (fuel_type: FuelType) => {
  const data = useDataContext();
  const total = data.data.lists.fuel_types.find(
    (x) => x.fuel_type === fuel_type
  );
  if (!total) return { output: 0, capacity: 0 };

  let bmOutput = 0;
  let bmCapacity = 0;

  for (const unit of data.data.lists.unit_groups) {
    if (unit.fuel_type === fuel_type) {
      bmOutput += unit.output.level;
      bmCapacity += unit.capacity;
    }
  }

  const embeddedOutput = Math.max(0, total.output.level - bmOutput);
  const embeddedCapacity = Math.max(0, total.capacity - bmCapacity);

  return {
    output: embeddedOutput,
    capacity: embeddedCapacity,
  };
};
