import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(user.role === "admin" ? "/admin" : "/");
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login({
        email,
        password,
      });

      navigate(
        loggedInUser.role === "admin" ? "/admin" : "/"
      );
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[48px] border-sky-400/10" />
        <div className="relative flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-bold text-slate-900">L</span><span className="font-semibold">Library</span></div>
        <div className="relative max-w-lg"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">A better reading routine</p><h1 className="display-font mt-4 text-5xl leading-tight">Every good library starts with one curious reader.</h1><p className="mt-6 max-w-md leading-7 text-slate-300">Keep your collection close, discover your next title, and make borrowing feel effortless.</p></div>
        <p className="relative text-sm text-slate-500">Your personal library workspace</p>
      </div>
      <div className="flex items-center justify-center bg-[#f5f7fb] px-5 py-12 sm:px-8">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Welcome back</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Sign in to Library</h1><p className="mt-2 text-sm text-slate-500">Pick up where your reading list left off.</p></div>

        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <label className="block text-sm font-semibold text-slate-700">Email<input
          type="email"
          required
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
        /></label>

        <label className="block text-sm font-semibold text-slate-700">Password<input
          type="password"
          required
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
        /></label>

        <button
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-slate-500">
          New to Library?{" "}
          <Link to="/register" className="font-semibold text-sky-700 hover:text-sky-800">
            Register
          </Link>
        </p>
      </form></div>
    </div>
  );
}