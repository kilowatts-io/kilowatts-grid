const NORMAL_BATTERY_COLOR = "grey";
const CHARGING_BATTERY_COLOR = "green";
const DISCHARGING_BATTERY_COLOR = "red";

export const calculateBatteryColor = (cycleSeconds: number) => {
    if (cycleSeconds === 0) return NORMAL_BATTERY_COLOR;
    if (cycleSeconds < 0) return CHARGING_BATTERY_COLOR;
    return DISCHARGING_BATTERY_COLOR;
};


