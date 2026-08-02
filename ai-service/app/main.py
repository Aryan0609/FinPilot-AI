from fastapi import FastAPI

from .schemas import (
    Transaction,
    PredictionResponse,
)

from .predictor import predict

app = FastAPI(
    title="FinPilot AI Fraud Detection",
    version="2.0"
)


@app.get("/")
def home():

    return {
        "status": "Running",
        "service": "FinPilot AI",
        "version": "2.0"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post(
    "/predict",
    response_model=PredictionResponse
)
def fraud_prediction(transaction: Transaction):

    result = predict(
        transaction.model_dump()
    )

    return PredictionResponse(**result)