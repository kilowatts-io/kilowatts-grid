from .ptypes import RequestParams
from datetime import datetime, timedelta
from pytz import utc


def get_request_params() -> RequestParams:
    """return the next exact minute"""
    dt = datetime.now().replace(tzinfo=utc)
    dt = dt.replace(second=0, microsecond=0) + timedelta(minutes=1)
    return RequestParams(dt=dt)
