import React, { useEffect, useState } from "react";
import Image from "../../assets/auth.png";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/slices/authSlice";
import { toast } from 'react-toastify';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { accessToken, loading, error } = useSelector((state) => state.auth);

  const handleRegister = async () => {

    try {

      const result = await dispatch(register({ name, email, password }));

      if (register.rejected.match(result)) {
        toast.error(result.payload || "Failed to register");
        setName('');
        setEmail('');
        setPassword('');

      } else {
        toast.success(result.payload.message || "Profile Updated successfully!");
        navigate("/account/overview");
      }
      
    }catch(error){
        toast.error("Failed to register: " + error.message);
    }
  }

  useEffect(() => {
    if (accessToken) {
      navigate("/account/overview");
    }
  }, [accessToken]);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl flex overflow-hidden gap-y-6 bg-white shadow-card sm:mb-20">
      {/* Left Side Image */}
      <img
        src={Image}
        alt="register-pics"
        className="w-full hidden sm:block sm:max-w-xs md:max-w-sm flex-shrink-0"
      />

      {/* Right Side Form */}
      <div className="w-full p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
            Sign Up
          </h1>
        </div>

        <div className="mb-6">
          <label className="field-title required">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(text) => setName(text.target.value)}
            className="w-full h-12 px-4 rounded-lg text-base border border-[#D9DBE9]"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label className="field-title required">Email</label>
            <button type="button" className="font-medium text-xs text-green-500">
              Use Phone Instead
            </button>
          </div>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(text) => setEmail(text.target.value)}
            placeholder="example@email.com"
            className="w-full h-12 px-4 rounded-lg text-base border border-[#D9DBE9]"
          />
        </div>

        <div className="mb-6">
          <label className="field-title required">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(text) => setPassword(text.target.value)}
            placeholder="••••••••"
            className="w-full h-12 px-4 rounded-lg text-base border border-[#D9DBE9]"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded shadow-md transition duration-300"
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span className="text-green-600 font-semibold cursor-pointer hover:underline">
            <Link to="/login">Sign in</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
