

export const BATTERY_R_TO_HEIGHT_RATIO = 0.1;
export const BATTERY_BASE_WIDTH_FRACTION = 0.8;
export const BATTERY_TERMINAL_WIDTH_FRACTION = 1 - BATTERY_BASE_WIDTH_FRACTION;

export const BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO = 0.05;

export const BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO = 0.3

export const calculateBatteryTerminalTop = (batteryHeight: number, terminalHeight: number) => {
    'worklet'
    return (batteryHeight - terminalHeight) / 2;
}