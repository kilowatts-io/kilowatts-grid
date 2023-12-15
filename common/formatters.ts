import { FuelType } from "./types"

export const formatters = {
    mw: (x: number) => {

        // if(x > 10000) {
        //     return `${Math.round(x/1000)} GW`
        // }

        const value = Math.round(x * 10)/10

        return `${value.toLocaleString()} MW`
    },
    fuelType: (x: FuelType) => {
        // capitalise first letter
        return x.charAt(0).toUpperCase() + x.slice(1)
    }
}
export default formatters