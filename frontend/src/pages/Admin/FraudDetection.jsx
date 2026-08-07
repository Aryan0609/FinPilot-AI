import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

export default function FraudDetection() {

  const [form, setForm] = useState({
    step: 1,
    type: "TRANSFER",
    amount: "",
    oldbalanceOrg: "",
    newbalanceOrig: "",
    oldbalanceDest: "",
    newbalanceDest: ""
  });

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const predictFraud = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await api.post(
        "/ai/predict",
        {
          step: Number(form.step),
          type: form.type,
          amount: Number(form.amount),
          oldbalanceOrg: Number(form.oldbalanceOrg),
          newbalanceOrig: Number(form.newbalanceOrig),
          oldbalanceDest: Number(form.oldbalanceDest),
          newbalanceDest: Number(form.newbalanceDest)
        }
      );

      setResult(response.data);

    } catch (err) {

      console.error(err);

      alert("Prediction Failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <AdminLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold text-white">

            AI Fraud Detection

          </h1>

          <p className="text-gray-400 mt-2">

            Predict fraudulent banking transactions using AI.

          </p>

        </div>

        <form
          onSubmit={predictFraud}
          className="grid grid-cols-2 gap-6 bg-[#141414] rounded-3xl p-8"
        >

          <input
            name="step"
            value={form.step}
            onChange={handleChange}
            placeholder="Step"
            className="bg-[#1A1A1A] rounded-xl p-4 text-white"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="bg-[#1A1A1A] rounded-xl p-4 text-white"
          >

            <option>TRANSFER</option>

            <option>CASH_OUT</option>

            <option>PAYMENT</option>

            <option>DEBIT</option>

            <option>CASH_IN</option>

          </select>

          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="bg-[#1A1A1A] rounded-xl p-4 text-white"
          />

          <input
            name="oldbalanceOrg"
            value={form.oldbalanceOrg}
            onChange={handleChange}
            placeholder="Old Balance Sender"
            className="bg-[#1A1A1A] rounded-xl p-4 text-white"
          />

          <input
            name="newbalanceOrig"
            value={form.newbalanceOrig}
            onChange={handleChange}
            placeholder="New Balance Sender"
            className="bg-[#1A1A1A] rounded-xl p-4 text-white"
          />

          <input
            name="oldbalanceDest"
            value={form.oldbalanceDest}
            onChange={handleChange}
            placeholder="Old Balance Receiver"
            className="bg-[#1A1A1A] rounded-xl p-4 text-white"
          />

          <input
            name="newbalanceDest"
            value={form.newbalanceDest}
            onChange={handleChange}
            placeholder="New Balance Receiver"
            className="bg-[#1A1A1A] rounded-xl p-4 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-violet-600 hover:bg-violet-500 rounded-xl py-4 text-white font-bold"
          >

            {loading ? "Predicting..." : "Predict Fraud"}

          </button>

        </form>

        {result && (

          <div className="bg-[#141414] rounded-3xl p-8 space-y-5">

            <h2 className="text-3xl font-bold text-white">

              Prediction Result

            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <p className="text-gray-400">

                  Prediction

                </p>

                <h2 className="text-2xl font-bold">

                  {result.prediction === 1
                    ? "🚨 Fraud"
                    : "✅ Safe"}

                </h2>

              </div>

              <div>

                <p className="text-gray-400">

                  Risk Level

                </p>

                <h2 className="text-2xl font-bold text-red-400">

                  {result.risk_level}

                </h2>

              </div>

              <div>

                <p className="text-gray-400">

                  Fraud Probability

                </p>

                <h2 className="text-2xl font-bold">

                  {(result.fraud_probability * 100).toFixed(2)}%

                </h2>

              </div>

              <div>

                <p className="text-gray-400">

                  Risk Score

                </p>

                <h2 className="text-2xl font-bold">

                  {result.risk_score}

                </h2>

              </div>

            </div>

            <div>

              <h3 className="text-xl font-bold text-white mb-3">

                Reasons

              </h3>

              <ul className="list-disc ml-6 text-gray-300">

                {result.reasons.map((reason, index) => (

                  <li key={index}>

                    {reason}

                  </li>

                ))}

              </ul>

            </div>

          </div>

        )}

      </div>

    </AdminLayout>

  );

}