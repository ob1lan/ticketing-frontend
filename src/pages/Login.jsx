import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <form onSubmit={handleLogin} className="w-96">
        <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-box shadow-md">
          <legend className="fieldset-legend text-lg font-bold">Login</legend>

          {error && <p className="text-error text-sm mb-2">{error}</p>}

          <label htmlFor="email" className="fieldset-label">Email</label>
          <input
            id="email"
            type="email"
            className="input input-bordered w-full mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="fieldset-label">Password</label>
          <input
            id="password"
            type="password"
            className="input input-bordered w-full mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-neutral w-full mt-4" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default Login;
