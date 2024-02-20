import pandas as pd
from .ptypes import InterpolatedValue
from datetime import datetime


def interpolate_dt(dt: datetime, levels: pd.Series) -> InterpolatedValue:
    """add dt to levels and interpolate to get the value at dt"""
    if dt in levels.index:
        value = levels.loc[dt]
        if type(value) == pd.Series:
            value = value.iloc[-1]
        return InterpolatedValue(level=value, delta=0)
    else:
        levels[dt] = None
        levels = levels.sort_index()
        dt_index = levels.index.get_loc(dt)

        diff_level = levels.iloc[dt_index + 1] - levels.iloc[dt_index - 1]
        if diff_level == 0:
            return InterpolatedValue(level=levels.iloc[dt_index - 1], delta=0)
        diff_secs = (
            levels.index[dt_index + 1] - levels.index[dt_index - 1]
        ).total_seconds()

        delta_per_sec = diff_level / diff_secs

        level_diff_secs = (dt - levels.index[dt_index - 1]).total_seconds()
        level = levels.iloc[dt_index - 1] + level_diff_secs * delta_per_sec

        delta_per_min = delta_per_sec * 60

        return InterpolatedValue(level=level, delta=delta_per_min)
