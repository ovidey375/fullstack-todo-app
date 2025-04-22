import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PageNotFound from "./components/PageNotFound";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("jwt", token);
      navigate("/");
    } else {
      localStorage.removeItem("jwt");
      navigate("/login");
    }
  }, [token, navigate]);
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Home setToken={setToken} /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login setToken={setToken} />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" /> : <Signup setToken={setToken} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
