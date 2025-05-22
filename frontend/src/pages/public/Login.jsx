import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/auth.png";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { accessToken, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      toast.success("Loggedin successfully!");
      navigate("/account/overview");
    }
  }, [accessToken]);

  const handleLogin = () => {
    dispatch(login({ email, password }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl flex overflow-hidden gap-y-6 bg-white shadow-card sm:mb-20">
      <img src={Image} alt="auth" className="hidden sm:block w-full sm:max-w-xs md:max-w-sm" />
      <div className="w-full p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-600 text-center">Sign In</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full h-12 px-4 mb-4 rounded-lg border"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full h-12 px-4 mb-4 rounded-lg border"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
        >
          {loading ? "Logging in..." : "Sign In"}
        </button>
        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
