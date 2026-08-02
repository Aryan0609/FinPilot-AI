import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(email, password);

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] px-6">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0e0e0e] to-[#1c1035]" />

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-700/20 blur-[120px]" />

      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-fuchsia-700/20 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .6 }}
          className="hidden lg:block"
        >

          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">

            <FaShieldAlt />

            AI Powered Banking

          </span>

          <h1 className="mt-8 text-6xl font-black leading-tight text-white">

            Smart Banking

            <span className="block bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">

              FinPilot AI

            </span>

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">

            Experience premium digital banking with intelligent fraud
            detection, secure payments, portfolio tracking and real-time
            financial insights.

          </p>

          <div className="mt-12 grid gap-5">

            {[
              "AI Fraud Detection",
              "Secure JWT Authentication",
              "Wallet & Fund Transfer",
              "Savings & Investments",
              "Real-Time Analytics",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#141414] p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
                  ✓
                </div>

                <span className="text-zinc-200">
                  {item}
                </span>
              </div>
            ))}

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          className="mx-auto w-full max-w-md"
        >

          <div className="rounded-[32px] border border-zinc-800 bg-[#141414]/90 p-10 shadow-2xl backdrop-blur-xl">

            <div className="mb-10 text-center">

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-4xl shadow-lg">

                🏦

              </div>

              <h2 className="text-4xl font-black text-white">
                Welcome Back
              </h2>

              <p className="mt-3 text-zinc-400">
                Sign in to continue to FinPilot AI
              </p>

            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] px-5 py-4 text-white outline-none transition focus:border-violet-500"
              />

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] px-5 py-4 pr-14 text-white outline-none transition focus:border-violet-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Login"}
              </button>

            </form>

            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-zinc-800" />

              <span className="text-sm text-zinc-500">
                OR
              </span>

              <div className="h-px flex-1 bg-zinc-800" />

            </div>

            <p className="text-center text-zinc-400">

              Don't have an account?

              <Link
                to="/register"
                className="ml-2 font-semibold text-violet-400 transition hover:text-violet-300"
              >
                Create Account
              </Link>

            </p>

          </div>

        </motion.div>

      </div>

    </div>
  );
}