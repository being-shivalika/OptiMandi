import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const logo = "/logo.png";

const Signup = () => {
  const { backendURL, setIsLoggedin, getUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const SubmitRegiter = async (e) => {
    e.preventDefault();

    // 🔴 DEBUG SAFETY (IMPORTANT)
    if (!backendURL) {
      toast.error("Backend URL is missing (env issue)");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendURL}/api/auth/register`,
        {
          name: name.trim(),
          email: email.trim(),
          password,
        },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        // store token
        localStorage.setItem("token", data.token);

        setIsLoggedin(true);

        // ensure token is available before API call
        setTimeout(() => {
          getUserData();
        }, 50);

        toast.success("Account created!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      console.log("SIGNUP ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#031700] to-[#001a16] p-8 text-slate-800 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-sm md:max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 md:h-130">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-24 lg:w-32 bg-gray-50 border-r border-gray-100 py-20 items-center relative">
          <img src={logo} className="w-8 h-8 mb-12 opacity-60" alt="logo" />

          <Link to="/login" className="mb-10 text-slate-400">
            Sign In
          </Link>

          <Link to="/signup" className="text-green-600 font-bold">
            Sign Up
          </Link>
        </div>

        {/* Hero */}
        <div className="hidden md:flex flex-1 bg-linear-to-br from-[#357c2df8] to-[#67ea03] items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Join Us</h2>
            <p className="text-sm mt-2">Create an account to get started</p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={SubmitRegiter}
          className="w-full md:w-100 lg:w-112.5 bg-white"
        >
          <div className="w-full p-6 md:p-12 flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-5 text-center">
              Create Account
            </h1>

            {/* NAME */}
            <div className="mb-4">
              <label htmlFor="name" className="text-xs font-bold">
                Username
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full h-12 border rounded-xl px-4 mt-1"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label htmlFor="email" className="text-xs font-bold">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full h-12 border rounded-xl px-4 mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label htmlFor="password" className="text-xs font-bold">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full h-12 border rounded-xl px-4 mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full h-12 bg-orange-500 text-white rounded-xl font-bold hover:scale-105 transition"
            >
              SIGN UP
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signup;
