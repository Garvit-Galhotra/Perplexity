import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const { handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleLogin({ email, password });

    navigate("/");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur rounded-lg shadow-2xl p-8 border border-cyan-500 border-opacity-20">
          <h1 className="text-4xl font-bold text-center mb-2 text-cyan-400">
            Welcome Back
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition"
                placeholder="Enter your mail"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/50 hover:cursor-pointer"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <a
              href="#"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              Forgot password?
            </a>
            <Link
              to="/register"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
