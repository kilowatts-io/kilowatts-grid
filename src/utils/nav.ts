/// functions to create urls for navigation

import { useLocalSearchParams } from "expo-router"
import { capitalise } from "./misc"

export const home = '/'
export const home_map = '/map'
export const fuel_type = (fuel_type: FuelType) => `/fuel_type/${fuel_type}`
export const fuel_type_map = (fuel_type: FuelType) => `/fuel_type/${fuel_type}/map`
export const unit_group = (unit_group: string) => `/unit_group/${unit_group.toLowerCase()}`
export const unit_group_map = (unit_group: string) => `/unit_group/${unit_group.toLowerCase()}/map`


// functions to extract a parameter from a url

export const useFuelType = () => useLocalSearchParams().fuel_type as FuelType;
export const useUnitCode = () => useLocalSearchParams().code as string;


// functions to extract a title

export const useFuelTypeTitle = () => capitalise(useFuelType())
