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
