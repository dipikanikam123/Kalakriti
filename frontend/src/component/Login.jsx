import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const returnTo = params.get("returnTo");

    if (token) {
      googleLogin(token);
      // Redirect to returnTo if available, otherwise to home
      navigate(returnTo || "/");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please enter email and password");
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check for returnTo parameter
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo");

      if (returnTo) {
        // Redirect to the return URL
        navigate(returnTo);
      } else {
        // Default redirect based on role
        if (result.role === "ADMIN") {
          navigate("/adminpanel");
        } else {
          navigate("/"); // Redirect to home page
        }
      }
    } else {
      alert(result.message || "Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = () => {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("returnTo");

    // Build OAuth URL with returnTo parameter if it exists
    let oauthUrl = "https://disgusted-fiann-kalakriti-33a27ac5.koyeb.app/oauth2/authorization/google";
    if (returnTo) {
      oauthUrl += `?returnTo=${encodeURIComponent(returnTo)}`;
    }

    window.location.href = oauthUrl;
  };

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-5 rounded-2xl shadow-xl w-96 transform hover:scale-105 transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="button"
            className="w-full py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-50 shadow-md transform active:scale-95 transition-all flex items-center justify-center"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="flex items-center justify-between my-4">
            <span className="w-1/5 border-b lg:w-1/4 border-gray-300"></span>
            <span className="text-xs text-center text-gray-500 uppercase">or continue with email</span>
            <span className="w-1/5 border-b lg:w-1/4 border-gray-300"></span>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-purple-500 text-white font-bold text-lg hover:bg-purple-600 shadow-lg transform active:scale-95 transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
