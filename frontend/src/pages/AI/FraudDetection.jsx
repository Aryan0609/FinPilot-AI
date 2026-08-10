import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import {
  predictFraud,
  checkAIStatus,
} from "../../services/aiService";

export default function FraudDetection() {
  const [status, setStatus] = useState("Checking...");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    type: "TRANSFER",
    amount: "",
    oldbalanceOrg: "",
    newbalanceOrig: "",
    oldbalanceDest: "",
    newbalanceDest: "",
    device_trusted: 1,
    location_match: 1,
    velocity: 1,
    failed_login_count: 0,
  });

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const response = await checkAIStatus();
      setStatus(response?.status || "Online");
    } catch {
      setStatus("Offline");
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setResult(null);
  };

  const analyzeTransaction = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setResult(null);

      const response = await predictFraud({
        step: new Date().getHours(),

        type: form.type,

        amount: Number(form.amount),

        oldbalanceOrg: Number(form.oldbalanceOrg),

        newbalanceOrig: Number(form.newbalanceOrig),

        oldbalanceDest: Number(form.oldbalanceDest),

        newbalanceDest: Number(form.newbalanceDest),

        device_trusted: Number(form.device_trusted),

        location_match: Number(form.location_match),

        velocity: Number(form.velocity),

        failed_login_count: Number(
          form.failed_login_count
        ),

        // Keep technical model inputs at safe defaults.
        ip_risk_score: 0.1,
        account_age_days: 365,
      });

      setResult(response);
    } catch (error) {
      console.error("Fraud prediction failed:", error);

      setResult({
        error:
          "Unable to analyze this transaction. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fraudProbability = result
    ? Math.max(
        0,
        Math.min(
          100,
          Number(result.fraud_probability) || 0
        )
      )
    : 0;

  const riskLevel = String(
    result?.risk_level || "LOW"
  ).toUpperCase();

  const isHigh = riskLevel === "HIGH";
  const isMedium = riskLevel === "MEDIUM";

  const statusLabel = isHigh
    ? "HIGH RISK"
    : isMedium
      ? "REVIEW REQUIRED"
      : "LOW RISK";

  return (
    <Layout>
      <div className="min-h-screen bg-[#080808] px-4 py-8 text-white md:px-8">

        {/* Header */}

        <div className="mx-auto mb-8 max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-xs uppercase tracking-[3px] text-violet-400">
                FinPilot AI
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Fraud Detection
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                Analyze a transaction for suspicious activity
                using FinPilot's AI risk engine.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "Online"
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              />

              <span className="text-xs text-zinc-400">
                AI {status}
              </span>
            </div>

          </div>
        </div>


        {/* Main */}

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-5">

          {/* Form */}

          <div className="rounded-3xl border border-zinc-800 bg-[#101010] p-6 lg:col-span-3">

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Transaction details
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Enter the information available to you.
              </p>
            </div>

            <form
              onSubmit={analyzeTransaction}
              className="space-y-5"
            >

              {/* Type */}

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Transaction type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-white outline-none transition focus:border-violet-500"
                >
                  <option value="TRANSFER">
                    Transfer
                  </option>

                  <option value="PAYMENT">
                    Payment
                  </option>

                  <option value="CASH_OUT">
                    Cash Out
                  </option>

                  <option value="CASH_IN">
                    Cash In
                  </option>

                  <option value="DEBIT">
                    Debit
                  </option>
                </select>
              </div>


              {/* Amount */}

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Transaction amount
                </label>

                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-white outline-none placeholder:text-zinc-700 focus:border-violet-500"
                />
              </div>


              {/* Balances */}

              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Your balance before transaction
                  </label>

                  <input
                    name="oldbalanceOrg"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.oldbalanceOrg}
                    onChange={handleChange}
                    placeholder="Current balance"
                    className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-white outline-none placeholder:text-zinc-700 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Your balance after transaction
                  </label>

                  <input
                    name="newbalanceOrig"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.newbalanceOrig}
                    onChange={handleChange}
                    placeholder="Expected balance"
                    className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-white outline-none placeholder:text-zinc-700 focus:border-violet-500"
                  />
                </div>

              </div>


              {/* Receiver */}

              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Receiver balance before
                  </label>

                  <input
                    name="oldbalanceDest"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.oldbalanceDest}
                    onChange={handleChange}
                    placeholder="Receiver balance"
                    className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-white outline-none placeholder:text-zinc-700 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Receiver balance after
                  </label>

                  <input
                    name="newbalanceDest"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.newbalanceDest}
                    onChange={handleChange}
                    placeholder="Expected receiver balance"
                    className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-white outline-none placeholder:text-zinc-700 focus:border-violet-500"
                  />
                </div>

              </div>


              {/* Security */}

              <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-4">

                <p className="mb-4 text-sm font-medium text-zinc-300">
                  Security signals
                </p>

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs text-zinc-500">
                      Trusted device
                    </label>

                    <select
                      name="device_trusted"
                      value={form.device_trusted}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-sm text-white"
                    >
                      <option value="1">
                        Yes
                      </option>

                      <option value="0">
                        No
                      </option>
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-xs text-zinc-500">
                      Location matches usual location
                    </label>

                    <select
                      name="location_match"
                      value={form.location_match}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-sm text-white"
                    >
                      <option value="1">
                        Yes
                      </option>

                      <option value="0">
                        No
                      </option>
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-xs text-zinc-500">
                      Recent transaction count
                    </label>

                    <input
                      name="velocity"
                      type="number"
                      min="0"
                      value={form.velocity}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-white"
                    />
                  </div>


                  <div>
                    <label className="mb-2 block text-xs text-zinc-500">
                      Failed login attempts
                    </label>

                    <input
                      name="failed_login_count"
                      type="number"
                      min="0"
                      value={form.failed_login_count}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-800 bg-[#080808] p-3 text-white"
                    />
                  </div>

                </div>

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-violet-600 py-4 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Analyzing transaction..."
                  : "Analyze transaction"}
              </button>

            </form>
          </div>


          {/* Result */}

          <div className="lg:col-span-2">

            {!result && (
              <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-zinc-800 bg-[#101010] p-8 text-center">

                <div>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl">
                    🛡️
                  </div>

                  <h2 className="font-semibold">
                    Ready to analyze
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Submit a transaction to see its fraud
                    probability and risk assessment.
                  </p>
                </div>

              </div>
            )}


            {result?.error && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-red-400">
                {result.error}
              </div>
            )}


            {result && !result.error && (
              <div className="rounded-3xl border border-zinc-800 bg-[#101010] p-6">

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[2px] text-zinc-600">
                      AI Analysis
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Prediction result
                    </h2>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      isHigh
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : isMedium
                          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                          : "border-green-500/30 bg-green-500/10 text-green-400"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>


                {/* Probability */}

                <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-5">

                  <div className="flex items-end justify-between">

                    <span className="text-sm text-zinc-500">
                      Fraud probability
                    </span>

                    <span className="text-3xl font-bold">
                      {fraudProbability.toFixed(2)}%
                    </span>

                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">

                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHigh
                          ? "bg-red-500"
                          : isMedium
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${fraudProbability}%`,
                      }}
                    />

                  </div>

                </div>


                {/* Reasons */}

                {Array.isArray(result.reasons) &&
                  result.reasons.length > 0 && (
                    <div className="mt-5">

                      <h3 className="mb-3 text-sm font-medium text-zinc-300">
                        Risk signals
                      </h3>

                      <div className="space-y-2">

                        {result.reasons.map(
                          (reason, index) => (
                            <div
                              key={`${reason}-${index}`}
                              className="rounded-xl border border-zinc-800 bg-[#0b0b0b] px-4 py-3 text-sm text-zinc-400"
                            >
                              {reason}
                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}


                {/* Recommendation */}

                <div className="mt-5 rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-4">

                  <p className="text-xs uppercase tracking-[2px] text-zinc-600">
                    Recommendation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {isHigh
                      ? "This transaction has a high fraud risk. Review the transaction carefully before proceeding."
                      : isMedium
                        ? "This transaction requires additional review. Verify the transaction details before proceeding."
                        : "The transaction appears safe according to the FinPilot AI fraud detection model."}
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </Layout>
  );
}
