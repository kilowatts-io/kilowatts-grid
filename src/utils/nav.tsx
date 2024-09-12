/// functions to create urls for navigation

import { useLocalSearchParams } from "expo-router";
import { capitalise } from "./misc";
import { Helmet } from "react-helmet";

export const home = "/";
export const home_map = "/map";
export const fuel_type = (fuel_type: FuelType) => `/fuel_type/${fuel_type}`;
export const fuel_type_map = (fuel_type: FuelType) =>
  `/fuel_type/${fuel_type}/map`;
export const unit_group = (unit_group: string) =>
  `/unit_group/${unit_group.toLowerCase()}`;
export const unit_group_map = (unit_group: string) =>
  `/unit_group/${unit_group.toLowerCase()}/map`;

// functions to extract a parameter from a url

export const useFuelType = () => useLocalSearchParams().fuel_type as FuelType;
export const useUnitCode = () => useLocalSearchParams().code as string;

// functions to extract a title

export const useFuelTypeTitle = () => capitalise(useFuelType());

export const HomeHelmet: React.FC = () => {
  return (
    <Helmet>
      <title>Kilowatts Grid</title>
      <meta
        name="description"
        content="Live output information for hundreds of generators on the GB electricity Grid"
      />
    </Helmet>
  );
};

export const HomeMapHelmet: React.FC = () => {
  return (
    <Helmet>
      <title>Kilowatts Grid Map</title>
      <meta
        name="description"
        content="Live mapped output information for hundreds of generators on the GB electricity Grid"
      />
    </Helmet>
  );
};

export const FuelTypeHelmet: React.FC<{
  fuel_type: FuelType;
}> = ({ fuel_type }) => {
  return (
    <Helmet>
      <title>{useFuelTypeTitle()} Generators</title>
      <meta
        name="description"
        content={`Live output information for ${useFuelTypeTitle()} generators on the GB electricity Grid`}
      />
    </Helmet>
  );
};

export const FuelTypeMapHelmet: React.FC = () => {
  return (
    <Helmet>
      <title>{useFuelTypeTitle()} Generators Map</title>
      <meta
        name="description"
        content={`Live mapped output information for ${useFuelTypeTitle()} generators on the GB electricity Grid`}
      />
    </Helmet>
  );
};

export const UnitGroupHelmet: React.FC<{
  unit_group: { name: string; fuel_type: FuelType };
}> = ({ unit_group }) => {
  return (
    <Helmet>
      <title>
        {unit_group.name} ({capitalise(unit_group.fuel_type)})
      </title>
      <meta
        name="description"
        content={`Live output information for ${unit_group.name} (${capitalise(
          unit_group.fuel_type
        )}) generators on the GB electricity Grid`}
      />
    </Helmet>
  );
};

export const UnitGroupHelmetMap: React.FC<{
    unit_group: { name: string; fuel_type: FuelType };
    }> = ({ unit_group }) => {
    return (
        <Helmet>
        <title>
            {unit_group.name} ({capitalise(unit_group.fuel_type)}) Map
        </title>
        <meta
            name="description"
            content={`Live mapped output information for ${unit_group.name} (${capitalise(
            unit_group.fuel_type
            )}) generators on the GB electricity Grid`}
        />
        </Helmet>
    );
    };