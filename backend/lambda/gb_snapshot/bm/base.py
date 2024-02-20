import pandas as pd
from datetime import datetime


class BaseElexonRequest:
    dt: datetime

    def _get_levels(self, df: pd.DataFrame) -> pd.Series:
        df = df.sort_values("timeFrom")
        index = []
        values = []
        for _, row in df.iterrows():
            index.append(row.timeFrom)
            values.append(row.levelFrom)
            index.append(row.timeTo)
            values.append(row.levelTo)
        return pd.Series(values, index=index)

    def _covers_relevant_period(self, levels: pd.Series) -> bool:
        return levels.index[0] <= self.dt <= levels.index[-1]

    # def _interpolate_dt(self, levels: pd.Series) -> InterpolatedValue:
    #     """add dt to levels and interpolate to get the value at dt"""
    #     if self.dt in levels.index:
    #         value = levels.loc[self.dt]
    #         if type(value) == pd.Series:
    #             value = value.iloc[-1]
    #         return InterpolatedValue(level=value, delta=0)
    #     else:
    #         levels[self.dt] = None
    #         levels = levels.sort_index()
    #         dt_index = levels.index.get_loc(self.dt)

    #         diff_secs = (
    #             levels.index[dt_index + 1] - levels.index[dt_index - 1]
    #         ).total_seconds()
    #         diff_level = levels.iloc[dt_index + 1] - levels.iloc[dt_index - 1]

    #         delta_per_sec = diff_level / diff_secs

    #         level_diff_secs = (self.dt - levels.index[dt_index - 1]).total_seconds()
    #         level = levels.iloc[dt_index - 1] + level_diff_secs * delta_per_sec

    #         delta_per_min = delta_per_sec * 60

    #         return InterpolatedValue(level=level, delta=delta_per_min)
