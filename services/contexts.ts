import { createContext } from "react";
import { UnitGroup } from "../common/types";

export const UnitGroupContext = createContext<UnitGroup | undefined>(undefined);