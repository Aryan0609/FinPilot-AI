import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";
import authService from "../../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: "9876543210",
        accountType: "SAVINGS",
        initialBalance: 2000,
      };

      await authService.register(payload);

      toast.success("Account created successfully!");

      navigate("/login");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] px-6">

      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0e0e0e] to-[#1b1034]" />

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-700/20 blur-[120px]" />

      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-fuchsia-700/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: .95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .5 }}
        className="relative w-full max-w-lg"
      >

        <div className="rounded-[32px] border border-zinc-800 bg-[#141414]/95 p-10 shadow-2xl backdrop-blur-xl">

          <div className="mb-10 text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-3xl text-white">

              <FaUserPlus />

            </div>

            <h1 className="text-4xl font-black text-white">
              Create Account
            </h1>

            <p className="mt-3 text-zinc-400">
              Join FinPilot AI Banking
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] px-5 py-4 text-white outline-none transition focus:border-violet-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] px-5 py-4 text-white outline-none transition focus:border-violet-500"
            />

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] px-5 py-4 pr-14 text-white outline-none transition focus:border-violet-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] px-5 py-4 pr-14 text-white outline-none transition focus:border-violet-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
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

            Already have an account?

            <Link
              to="/login"
              className="ml-2 font-semibold text-violet-400 transition hover:text-violet-300"
            >
              Login
            </Link>

          </p>

        </div>

      </motion.div>

    </div>
  );
}