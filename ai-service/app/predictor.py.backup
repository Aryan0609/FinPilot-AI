import joblib
import pandas as pd
from pathlib import Path

# ----------------------------------------------------
# Load Models
# ----------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(BASE_DIR / "models" / "fraud_model.pkl")
encoder = joblib.load(BASE_DIR / "models" / "label_encoder.pkl")
feature_columns = joblib.load(BASE_DIR / "models" / "feature_columns.pkl")
threshold = joblib.load(BASE_DIR / "models" / "threshold.pkl")


# ----------------------------------------------------
# Prediction
# ----------------------------------------------------

def predict(transaction):

    df = pd.DataFrame([transaction])

    # Encode transaction type
    df["type"] = encoder.transform(df["type"])

    # -------------------------------
    # Feature Engineering
    # -------------------------------

    df["hour"] = df["step"] % 24

    df["night_transaction"] = (
        (df["hour"] >= 22) |
        (df["hour"] <= 5)
    ).astype(int)

    df["sender_change"] = (
        df["oldbalanceOrg"] -
        df["newbalanceOrig"]
    )

    df["receiver_change"] = (
        df["newbalanceDest"] -
        df["oldbalanceDest"]
    )

    df["amount_balance_ratio"] = (
        df["amount"] /
        (df["oldbalanceOrg"] + 1)
    )

    df["large_transaction"] = (
        df["amount"] > 50000
    ).astype(int)

    df["high_balance_usage"] = (
        df["amount_balance_ratio"] > 0.80
    ).astype(int)

    df["zero_sender_balance"] = (
        df["oldbalanceOrg"] == 0
    ).astype(int)

    df["zero_receiver_balance"] = (
        df["oldbalanceDest"] == 0
    ).astype(int)

    df["suspicious_amount"] = (
        df["amount"] > 100000
    ).astype(int)

    df["balance_usage_percent"] = (
        df["amount_balance_ratio"] * 100
    )

    # Keep same order as training
    df = df[feature_columns]

    # -----------------------------------
    # ML Prediction
    # -----------------------------------

    probability = float(
        model.predict_proba(df)[0][1]
    )

    prediction = int(
        probability >= threshold
    )

    # -----------------------------------
    # Rule Engine
    # -----------------------------------

    risk_score = probability * 100

    reasons = []

    if transaction["amount"] > 50000:
        risk_score += 20
        reasons.append("Large Transaction")

    if transaction["oldbalanceOrg"] == 0:
        risk_score += 20
        reasons.append("Sender Has Zero Balance")

    if transaction["oldbalanceDest"] == 0:
        risk_score += 10
        reasons.append("Receiver Has Zero Balance")

    if (
        transaction["amount"] /
        (transaction["oldbalanceOrg"] + 1)
    ) > 0.80:
        risk_score += 20
        reasons.append("High Balance Usage")

    hour = transaction["step"] % 24

    if hour >= 22 or hour <= 5:
        risk_score += 10
        reasons.append("Night Transaction")

    risk_score = min(risk_score, 100)

    if risk_score >= 80:
        risk_level = "HIGH"
    elif risk_score >= 50:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {

        "prediction": prediction,

        "fraud_probability": round(
            probability * 100,
            2
        ),

        "risk_score": round(
            risk_score,
            2
        ),

        "risk_level": risk_level,

        "reasons": reasons

    }