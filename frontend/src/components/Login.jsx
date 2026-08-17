import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;

      if (!token) {
        setError("Login successful but token was not received.");
        return;
      }

      // Save JWT
      localStorage.setItem("token", token);

      // Go to dashboard
      navigate("/admin", { replace: true });

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 flex items-center justify-center">

      <div className="w-full max-w-md">

        {/* HEADER */}

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl shadow-lg shadow-blue-600/20">
            🏠
          </div>

          <h1 className="text-3xl font-bold text-white">
            Northline Admin
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Roofing Management Dashboard
          </p>

        </div>


        {/* LOGIN CARD */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-white">
              Owner Login
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access the admin dashboard.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

              <p className="text-sm text-red-400">
                {error}
              </p>

            </div>
          )}


          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="owner@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>


            {/* PASSWORD */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">

                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Signing in...

                </span>
              ) : (
                "Sign In"
              )}
            </button>

          </form>

        </div>


        <p className="mt-6 text-center text-xs text-slate-600">
          Authorized owner access only
        </p>

      </div>

    </div>
  );
};

export default Login;