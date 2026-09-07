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
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-bold">Login</h1>

        {error && (
          <p className="rounded bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="w-full rounded border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          className="w-full rounded border p-3"
        />

        <button
          disabled={loading}
          className="w-full rounded bg-indigo-600 p-3 text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center">
          No account?{" "}
          <Link to="/register" className="text-indigo-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}