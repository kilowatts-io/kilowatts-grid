from pydantic import BaseModel


class InterpolatedValue(BaseModel):
    level: float
    delta: float
