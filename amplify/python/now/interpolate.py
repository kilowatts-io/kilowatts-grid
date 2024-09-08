from typing import List
from .types import LevelPair, UnitOutput, UnitPointInTime, UnitRecords
from datetime import datetime
from .logs import logging


def interpolate_values(values: List[LevelPair], dt: datetime) -> UnitOutput:
    """Interpolate the values to the target datetime, measured in MW per minute.

    The function performs linear interpolation if the target datetime
    is between two known values. If there's an exact match, it returns the value directly.

    Args:
        values (List[LevelPair]): A list of LevelPair objects, each containing a datetime and a value.
        dt (datetime): The target datetime for interpolation.

    Returns:
        float: Interpolated or exact value corresponding to the target datetime.

    Raises:
        ValueError: If the target datetime is outside the range of the given values.
    """

    # If there's an exact match, return the value without interpolation
    if len(values) == 0 or dt < values[0].d or dt > values[-1].d:
        return None

    # Find the two values that the target datetime falls between
    for i in range(1, len(values)):

        if values[i].d == dt:
            return UnitOutput(level=values[i].x, delta=0.0)

        if values[i - 1].d <= dt < values[i].d:
            # Perform linear interpolation between the two points
            v1, v2 = values[i - 1], values[i]

            # Calculate the time difference in minutes
            time_diff_minutes = (v2.d - v1.d).total_seconds() / 60.0
            dt_diff_minutes = (dt - v1.d).total_seconds() / 60.0

            # Calculate the rate of change (MW per minute)
            mw_per_minute = (v2.x - v1.x) / time_diff_minutes

            # Interpolate the value using MW per minute
            interpolated_value = v1.x + mw_per_minute * dt_diff_minutes

            return UnitOutput(level=interpolated_value, delta=mw_per_minute)

    # In case of an unexpected condition (this should not be reached)
    raise ValueError(f"Could not interpolate the value for datetime {dt}")


def get_mels_value(values: List[LevelPair], dt: datetime) -> float:
    """for mels, get the latest value at the time of the target datetime"""
    value = None
    for v in values:
        if v.d <= dt:
            value = v.x
    if value:
        return value

    return 0.0


def planned_output(
    ur: UnitRecords, dt: datetime, unit_name: str = None
) -> UnitPointInTime:
    """take the unit records and return the planned output at the target datetime"""
    pn = interpolate_values(ur.pn, dt)

    boalf = interpolate_values(ur.boalf, dt)
    if boalf:
        if unit_name:
            logging.debug(f"{unit_name} has a BOALF of {boalf.level}")
        output = boalf
    else:
        output = pn

    # throw an error if there's no output
    if not output:
        print(f"no output for {unit_name} - defaulting to 0")
        output = UnitOutput(level=0, delta=0)

    capacity = get_mels_value(ur.mels, dt)
    # # if capacity < output increase capacity to output
    # if capacity < output.level:
    #     capacity = output.level

    if boalf:
        balancing_volume = boalf.level - pn.level
    else:
        balancing_volume = 0.0

    return UnitPointInTime(
        output=output, capacity=capacity, balancing_volume=balancing_volume
    )
