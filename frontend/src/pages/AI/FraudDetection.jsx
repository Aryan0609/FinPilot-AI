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
    step: 1,
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
    ip_risk_score: 0.1,
    account_age_days: 365,
    hour: new Date().getHours(),
  });

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const res = await checkAIStatus();
      setStatus(res.status || "Online");
    } catch {
      setStatus("Offline");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const analyzeTransaction = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await predictFraud({
        ...form,
        amount: Number(form.amount),
        oldbalanceOrg: Number(form.oldbalanceOrg),
        newbalanceOrig: Number(form.newbalanceOrig),
        oldbalanceDest: Number(form.oldbalanceDest),
        newbalanceDest: Number(form.newbalanceDest),
        velocity: Number(form.velocity),
        failed_login_count: Number(form.failed_login_count),
        ip_risk_score: Number(form.ip_risk_score),
        account_age_days: Number(form.account_age_days),
        hour: Number(form.hour),
        device_trusted: Number(form.device_trusted),
        location_match: Number(form.location_match),
      });

      setResult(response);
    } catch (err) {
      console.error(err);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-8">

        <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-8">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-black text-white">
                🤖 AI Fraud Detection
              </h1>

              <p className="mt-2 text-zinc-400">
                Analyze a banking transaction using the
                FinPilot AI fraud detection model.
              </p>

            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                status === "Online"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {status}
            </span>

          </div>

        </div>

        <form
          onSubmit={analyzeTransaction}
          className="space-y-8"
        >

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-8">

            <h2 className="mb-6 text-2xl font-bold text-white">
              Transaction Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-zinc-400">
                  Step
                </label>

                <input
                  name="step"
                  type="number"
                  value={form.step}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />
              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  Transaction Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                >
                  <option value="TRANSFER">TRANSFER</option>
                  <option value="CASH_OUT">CASH_OUT</option>
                  <option value="CASH_IN">CASH_IN</option>
                  <option value="PAYMENT">PAYMENT</option>
                  <option value="DEBIT">DEBIT</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  Amount
                </label>

                <input
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  Old Balance (Sender)
                </label>

                <input
                  name="oldbalanceOrg"
                  type="number"
                  value={form.oldbalanceOrg}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  New Balance (Sender)
                </label>

                <input
                  name="newbalanceOrig"
                  type="number"
                  value={form.newbalanceOrig}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  Old Balance (Receiver)
                </label>

                <input
                  name="oldbalanceDest"
                  type="number"
                  value={form.oldbalanceDest}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  New Balance (Receiver)
                </label>

                <input
                  name="newbalanceDest"
                  type="number"
                  value={form.newbalanceDest}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

                            <div>

                <label className="mb-2 block text-zinc-400">
                  Trusted Device
                </label>

                <select
                  name="device_trusted"
                  value={form.device_trusted}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  Location Match
                </label>

                <select
                  name="location_match"
                  value={form.location_match}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  Velocity
                </label>

                <input
                  name="velocity"
                  type="number"
                  value={form.velocity}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  Failed Login Count
                </label>

                <input
                  name="failed_login_count"
                  type="number"
                  value={form.failed_login_count}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  IP Risk Score
                </label>

                <input
                  name="ip_risk_score"
                  type="number"
                  step="0.01"
                  value={form.ip_risk_score}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  Account Age (Days)
                </label>

                <input
                  name="account_age_days"
                  type="number"
                  value={form.account_age_days}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

              <div>

                <label className="mb-2 block text-zinc-400">
                  Hour
                </label>

                <input
                  name="hour"
                  type="number"
                  min="0"
                  max="23"
                  value={form.hour}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-[#0d0d0d] p-3 text-white"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-violet-600 py-4 text-lg font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Analyze Transaction"}
            </button>

          </div>

        </form>

        {result && (

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-8">

            <h2 className="mb-8 text-2xl font-bold text-white">
              AI Prediction Result
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <p className="text-sm uppercase tracking-wider text-zinc-500">
                  Prediction
                </p>

                <span
                  className={`mt-3 inline-block rounded-full px-4 py-2 font-bold ${
                    result.prediction === 1
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {result.prediction === 1
                    ? "🚨 FRAUD"
                    : "✅ SAFE"}
                </span>

              </div>

              <div>

                <p className="text-sm uppercase tracking-wider text-zinc-500">
                  Fraud Probability
                </p>

                <h2 className="mt-3 text-4xl font-black text-white">
                  {(result.fraud_probability * 100).toFixed(2)}%
                </h2>

              </div>

            </div>

            <div className="mt-8">

              <div className="h-4 overflow-hidden rounded-full bg-zinc-800">

                <div
                  className={`h-full rounded-full transition-all ${
                    result.prediction === 1
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${result.fraud_probability * 100}%`,
                  }}
                />

              </div>

            </div>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6">

              <h3 className="mb-3 text-lg font-bold text-white">
                Recommendation
              </h3>

              <p className="text-zinc-300">

                {result.prediction === 1
                  ? "This transaction appears suspicious. Review it carefully before proceeding."
                  : "The transaction appears safe according to the FinPilot AI fraud detection model."}

              </p>

            </div>

          </div>

        )}

      </div>

    </Layout>
  );
}