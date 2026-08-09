import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaLock,
  FaCheckCircle,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast.error("Please enter your email or user ID.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      await login(cleanEmail, password);

      toast.success("Welcome back to FinPilot AI!");

      // Small delay gives the success animation time to appear.
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error("Login failed:", err);

      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 401 || status === 403) {
        toast.error("Invalid email/user ID or password.");
      } else if (!err?.response) {
        toast.error(
          "Unable to connect to FinPilot. Please try again."
        );
      } else {
        toast.error(
          message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "AI-powered fraud detection",
    "Secure JWT authentication",
    "Wallet & instant transfers",
    "Fixed deposits "Savings & fixed deposits" investments",
    "Mutual fund portfolio tracking",
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060606] px-4 py-8 sm:px-6">

      {/* =========================================================
          ANIMATED BACKGROUND
      ========================================================= */}

      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0b0b0b] to-[#160d2b]" />

      <motion.div
        className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[130px]"
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-fuchsia-700/20 blur-[130px]"
        animate={{
          x: [0, -70, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle moving grid */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

        {/* =======================================================
            LEFT SIDE
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="hidden lg:block"
        >

          {/* Badge */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300"
          >
            <FaShieldAlt className="text-violet-400" />

            AI Powered Banking

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          </motion.div>

          {/* Heading */}

          <h1 className="mt-8 text-5xl font-black leading-[1.05] text-white xl:text-7xl">

            Your money.

            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Your intelligence.
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
            Experience intelligent digital banking with secure payments,
            AI-powered fraud detection, investments and real-time financial
            insights — all in one place.
          </p>

          {/* Features */}

          <div className="mt-10 space-y-3">

            {features.map((item, index) => (
              <motion.div
                key={item}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.35 + index * 0.08,
                }}
                whileHover={{
                  x: 6,
                }}
                className="flex items-center gap-4 rounded-2xl border border-zinc-800/80 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors hover:border-violet-500/30 hover:bg-violet-500/[0.05]"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <FaCheckCircle />
                </div>

                <span className="text-zinc-200">
                  {item}
                </span>

              </motion.div>
            ))}

          </div>

          {/* Security note */}

          <div className="mt-8 flex items-center gap-3 text-sm text-zinc-500">
            <FaLock className="text-emerald-500" />
            Protected with secure authentication
          </div>

        </motion.div>

        {/* =======================================================
            LOGIN CARD
        ======================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mx-auto w-full max-w-md"
        >

          {/* Glow */}

          <div className="relative">

            <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-xl" />

            <div className="relative rounded-[32px] border border-zinc-800/90 bg-[#111111]/95 p-7 shadow-2xl backdrop-blur-2xl sm:p-10">

              {/* Logo */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.25,
                  type: "spring",
                  stiffness: 180,
                }}
                className="mb-7 flex justify-center"
              >

                <div className="relative">

                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(139,92,246,0)",
                        "0 0 35px rgba(139,92,246,.35)",
                        "0 0 0px rgba(139,92,246,0)",
                      ],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                    className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-3xl text-white"
                  >
                    🏦
                  </motion.div>

                  <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#111111] bg-emerald-500 text-xs text-black">
                    ✓
                  </div>

                </div>

              </motion.div>

              {/* Header */}

              <div className="mb-8 text-center">

                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Welcome Back
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Sign in to securely access your FinPilot account
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Email or User ID
                  </label>

                  <div
                    className={`relative transition-all duration-300 ${
                      focused === "email"
                        ? "scale-[1.01]"
                        : ""
                    }`}
                  >

                    <FaUser
                      className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                        focused === "email"
                          ? "text-violet-400"
                          : "text-zinc-600"
                      }`}
                    />

                    <input
                      type="text"
                      placeholder="Enter your email or user ID"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      onFocus={() =>
                        setFocused("email")
                      }
                      onBlur={() =>
                        setFocused("")
                      }
                      autoComplete="username"
                      required
                      className="w-full rounded-2xl border border-zinc-800 bg-[#090909] py-4 pl-12 pr-5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-300 hover:border-zinc-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="block text-sm font-medium text-zinc-300">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        toast("Password reset is not enabled yet.")
                      }
                      className="text-xs font-medium text-violet-400 transition hover:text-violet-300"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div
                    className={`relative transition-all duration-300 ${
                      focused === "password"
                        ? "scale-[1.01]"
                        : ""
                    }`}
                  >

                    <FaLock
                      className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                        focused === "password"
                          ? "text-violet-400"
                          : "text-zinc-600"
                      }`}
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      onFocus={() =>
                        setFocused("password")
                      }
                      onBlur={() =>
                        setFocused("")
                      }
                      autoComplete="current-password"
                      required
                      className="w-full rounded-2xl border border-zinc-800 bg-[#090909] py-4 pl-12 pr-14 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-300 hover:border-zinc-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-white"
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                </div>

                {/* LOGIN BUTTON */}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={
                    !loading
                      ? {
                          scale: 1.015,
                        }
                      : {}
                  }
                  whileTap={
                    !loading
                      ? {
                          scale: 0.98,
                        }
                      : {}
                  }
                  className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-violet-900/20 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {/* Button shine */}

                  {!loading && (
                    <motion.div
                      className="absolute inset-y-0 -left-20 w-20 bg-white/20 blur-xl"
                      animate={{
                        x: ["0%", "600%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  )}

                  <AnimatePresence mode="wait">

                    {loading ? (
                      <motion.span
                        key="loading"
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="flex items-center gap-3"
                      >

                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Signing you in...

                      </motion.span>
                    ) : (
                      <motion.span
                        key="login"
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="flex items-center gap-2"
                      >

                        Sign In

                        <FaArrowRight className="transition-transform group-hover:translate-x-1" />

                      </motion.span>
                    )}

                  </AnimatePresence>

                </motion.button>

              </form>

              {/* Divider */}

              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-zinc-800" />

                <span className="text-xs font-medium text-zinc-600">
                  NEW TO FINPILOT?
                </span>

                <div className="h-px flex-1 bg-zinc-800" />

              </div>

              {/* Register */}

              <Link
                to="/register"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-white/[0.02] py-4 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:border-violet-500/40 hover:bg-violet-500/[0.05] hover:text-white"
              >

                Create a new account

                <FaArrowRight className="text-xs text-violet-400 transition-transform group-hover:translate-x-1" />

              </Link>

              {/* Footer */}

              <div className="mt-7 flex items-center justify-center gap-2 text-xs text-zinc-600">

                <FaShieldAlt className="text-emerald-500" />

                Secure FinPilot AI authentication

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      {/* =========================================================
          MOBILE BRAND
      ========================================================= */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.8,
        }}
        className="absolute bottom-3 left-0 right-0 text-center text-xs text-zinc-700 lg:hidden"
      >
        FinPilot AI • Intelligent Banking
      </motion.div>

    </div>
  );
}