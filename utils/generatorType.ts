import { GeneratorType } from "../state/hooks/unitGroupsLive";

export const formatGeneratorType = (
  generatorType: GeneratorType | "interconnector"
) => {
  switch (generatorType) {
    case "biomass":
      return "Biomass";
    case "coal":
      return "Coal";
    case "gas":
      return "Gas";
    case "hydro":
      return "Hydro";
    case "interconnector":
      return "Interconnector";
    case "nuclear":
      return "Nuclear";
    case "oil":
      return "Oil";
    case "other":
      return "Other";
    case "wind":
      return "Wind";
    case "battery":
      return "Battery";
    case "solar":
      return "Solar";
    default:
      return generatorType;
  }
};
