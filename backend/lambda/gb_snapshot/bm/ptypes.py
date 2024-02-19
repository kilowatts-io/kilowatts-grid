from pydantic import BaseModel, Field
from datetime import datetime, date


class SettlementPeriodParams(BaseModel):
    settlementDate: date
    settlementPeriod: int = Field(..., ge=1, le=50)


class FromToParams(BaseModel):
    from_: datetime
    to: datetime

    def model_dump(self):
        return {"from": self.from_.isoformat(), "to": self.to.isoformat()}


class InterpolatedValue(BaseModel):
    level: float
    delta: float
