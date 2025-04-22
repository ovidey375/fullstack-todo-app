import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://fullstack-todo-app-69m3.onrender.com/api/user/login",
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res.data);
      const token = res.data.token;
      if (token) {
        setToken(token); // Update App state (also stores in localStorage + redirects)
        toast.success("Login successful");
        navigateTo("/");
      } else {
        toast.error("Token not received");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors || "User registration failed");
    }
  };
  return (
    <div>
      <div>
        <div className="flex h-screen items-center justify-center bg-gray-100">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-5 text-center">Login</h2>
            <form onSubmit={handleLogin}>
              {/* email */}
              <div className="mb-4">
                <label className="block mb-2 font-semibold" htmlFor="">
                  Email
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Type Email"
                />
              </div>
              {/* password */}
              <div className="mb-4">
                <label className="block mb-2 font-semibold" htmlFor="">
                  Password
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type Password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-900 duration-300 rounded-xl font-semibold p-3"
              >
                Login
              </button>
              <p className="mt-4 text-center text-gray-600">
                New user?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Signup
                </Link>{" "}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
