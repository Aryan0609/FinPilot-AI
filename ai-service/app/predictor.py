import joblib
import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(
    BASE_DIR / "models" / "fraud_model.pkl"
)

encoder = joblib.load(
    BASE_DIR / "models" / "label_encoder.pkl"
)

feature_columns = joblib.load(
    BASE_DIR / "models" / "feature_columns.pkl"
)

threshold = joblib.load(
    BASE_DIR / "models" / "threshold.pkl"
)


def predict(transaction):

    df = pd.DataFrame([transaction])

    # ------------------------------------------------
    # Feature engineering
    # ------------------------------------------------

    df["type"] = encoder.transform(df["type"])

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

    # EXACT training feature order
    df = df[feature_columns]

    # ------------------------------------------------
    # ML model
    # ------------------------------------------------

    model_probability = float(
        model.predict_proba(df)[0][1]
    )

    model_probability_percent = (
        model_probability * 100
    )

    # ------------------------------------------------
    # Behavioral risk engine
    # ------------------------------------------------

    rule_score = 0.0
    reasons = []

    amount = float(transaction["amount"])

    old_sender = float(
        transaction["oldbalanceOrg"]
    )

    new_sender = float(
        transaction["newbalanceOrig"]
    )

    device_trusted = int(
        transaction.get("device_trusted", 1)
    )

    location_match = int(
        transaction.get("location_match", 1)
    )

    velocity = int(
        transaction.get("velocity", 1)
    )

    failed_logins = int(
        transaction.get("failed_login_count", 0)
    )

    ip_risk = float(
        transaction.get("ip_risk_score", 0.0)
    )

    account_age = int(
        transaction.get("account_age_days", 365)
    )

    hour = int(
        transaction["step"] % 24
    )

    # ------------------------------------------------
    # Amount
    # ------------------------------------------------

    if amount > 50000:
        rule_score += 15
        reasons.append(
            "Large Transaction"
        )

    if amount > 100000:
        rule_score += 10
        reasons.append(
            "Very Large Transaction"
        )

    # ------------------------------------------------
    # Balance usage
    # ------------------------------------------------

    balance_ratio = (
        amount /
        (old_sender + 1)
    )

    if balance_ratio > 0.80:
        rule_score += 20
        reasons.append(
            "High Balance Usage"
        )

    if balance_ratio > 1.0:
        rule_score += 15
        reasons.append(
            "Transaction Exceeds Sender Balance"
        )

    # ------------------------------------------------
    # Balance consistency
    # ------------------------------------------------

    expected_sender_balance = (
        old_sender - amount
    )

    if (
        expected_sender_balance >= 0
        and abs(
            expected_sender_balance -
            new_sender
        ) > max(100, amount * 0.05)
    ):
        rule_score += 15
        reasons.append(
            "Unusual Sender Balance Change"
        )

    if (
        amount > old_sender
        and old_sender > 0
    ):
        rule_score += 15
        reasons.append(
            "Amount Exceeds Available Balance"
        )

    # ------------------------------------------------
    # Device
    # ------------------------------------------------

    if device_trusted == 0:
        rule_score += 15
        reasons.append(
            "Untrusted Device"
        )

    # ------------------------------------------------
    # Location
    # ------------------------------------------------

    if location_match == 0:
        rule_score += 15
        reasons.append(
            "Location Mismatch"
        )

    # ------------------------------------------------
    # Velocity
    # ------------------------------------------------

    if velocity >= 5:
        rule_score += 10
        reasons.append(
            "High Transaction Velocity"
        )

    if velocity >= 10:
        rule_score += 10
        reasons.append(
            "Very High Transaction Velocity"
        )

    # ------------------------------------------------
    # Failed logins
    # ------------------------------------------------

    if failed_logins >= 3:
        rule_score += 10
        reasons.append(
            "Multiple Failed Login Attempts"
        )

    if failed_logins >= 5:
        rule_score += 10
        reasons.append(
            "Excessive Failed Login Attempts"
        )

    # ------------------------------------------------
    # IP risk
    # ------------------------------------------------

    if ip_risk >= 0.50:
        rule_score += 10
        reasons.append(
            "High IP Risk"
        )

    if ip_risk >= 0.80:
        rule_score += 10
        reasons.append(
            "Very High IP Risk"
        )

    # ------------------------------------------------
    # Account age
    # ------------------------------------------------

    if account_age < 30:
        rule_score += 10
        reasons.append(
            "New Account"
        )

    if account_age < 7:
        rule_score += 10
        reasons.append(
            "Very New Account"
        )

    # ------------------------------------------------
    # Night transaction
    # ------------------------------------------------

    if hour >= 22 or hour <= 5:
        rule_score += 10
        reasons.append(
            "Night Transaction"
        )

    # ------------------------------------------------
    # Cap rule score
    # ------------------------------------------------

    rule_score = min(
        rule_score,
        100
    )

    # ------------------------------------------------
    # Hybrid probability
    #
    # ML model      35%
    # Rules         65%
    # ------------------------------------------------

    combined_probability = (
        (model_probability_percent * 0.35)
        +
        (rule_score * 0.65)
    )

    combined_probability = min(
        max(combined_probability, 0.0),
        100.0
    )

    # ------------------------------------------------
    # Critical fraud indicators
    # ------------------------------------------------

    critical_signals = 0

    if amount > 100000:
        critical_signals += 1

    if balance_ratio > 1.0:
        critical_signals += 1

    if device_trusted == 0:
        critical_signals += 1

    if location_match == 0:
        critical_signals += 1

    if velocity >= 10:
        critical_signals += 1

    if ip_risk >= 0.80:
        critical_signals += 1

    if failed_logins >= 5:
        critical_signals += 1

    # Multiple independent high-risk indicators
    # should not be hidden by a conservative ML model.

    if critical_signals >= 3:
        combined_probability = max(
            combined_probability,
            85.0
        )

    elif critical_signals >= 2:
        combined_probability = max(
            combined_probability,
            70.0
        )

    # ------------------------------------------------
    # Final classification
    # ------------------------------------------------

    if combined_probability >= 70:
        prediction = 1
        risk_level = "HIGH"

    elif combined_probability >= 35:
        prediction = 0
        risk_level = "MEDIUM"

    else:
        prediction = 0
        risk_level = "LOW"

    reasons = list(
        dict.fromkeys(reasons)
    )

    return {
        "prediction": prediction,
        "fraud_probability": round(
            combined_probability,
            2
        ),
        "risk_score": round(
            combined_probability,
            2
        ),
        "risk_level": risk_level,
        "reasons": reasons
    }
