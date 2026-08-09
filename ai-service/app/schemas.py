from pydantic import BaseModel


class Transaction(BaseModel):
    step: int
    type: str
    amount: float
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float

    device_trusted: int = 1
    location_match: int = 1
    velocity: int = 1
    failed_login_count: int = 0
    ip_risk_score: float = 0.0
    account_age_days: int = 365


class PredictionResponse(BaseModel):
    prediction: int
    fraud_probability: float
    risk_score: float
    risk_level: str
    reasons: list[str]
