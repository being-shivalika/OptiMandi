import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const logo = "/logo.png";

const Signup = () => {
  // Destructure correctly from the fixed context
  const { setIsLoggedin, getUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const SubmitRegiter = async (e) => {
    e.preventDefault();
    try {
      // It's better to set this globally in main.jsx, but here is fine for now
      axios.defaults.withCredentials = true;

      // Use template literals to avoid double-slash errors
      const { data } = await axios.post(
        `https://opti-mandi.vercel.app/api/auth/register`,
        {
          name,
          email,
          password,
        },
      );

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        toast.success("Account created!");
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      // Safely access the error message from the backend
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    /* ... your existing JSX ... */
    <section className="min-h-screen w-full flex items-center justify-center   bg-linear-to-br from-[#031700] to-[#001a16] p-8 text-slate-800 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-sm md:max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 md:h-130">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-24 lg:w-32 bg-gray-50 border-r border-gray-100 py-20 items-center relative">
          <img src={logo} className="w-8 h-8 mb-12 opacity-60" alt="logo" />
          <div
            className="absolute left-0 w-1 bg-[#60d44c]
text-[#4cd497]  transition-all duration-500 rounded-r-full top-55 h-12"
          />
          <Link
            to="/login"
            className="flex flex-col items-center gap-2 mb-10 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="ai-person-check text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-tighter hover:text-green-900 ">
              Sign In
            </span>
          </Link>
          <Link
            to="/signup"
            className="flex flex-col items-center gap-2 text-[#60d44c]"
          >
            <i className="ai-person-add text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Sign Up
            </span>
          </Link>
        </div>

        {/* Hero */}
        <div className="hidden md:flex flex-1 bg-linear-to-br  from-[#357c2df8] to-[#67ea03]  relative overflow-hidden items-center justify-center">
          <div className="absolute flex flex-col items-center p-10 text-white text-center">
            <h2 className="text-3xl font-bold">Join Us.</h2>
            <p className="opacity-90 text-sm mt-2">
              Create an account to get started.
            </p>
            <img
              src={logo}
              className="w-64 mt-8 drop-shadow-xl rounded-4xl"
              alt="hero"
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={SubmitRegiter}
          className="w-full md:w-100 lg:w-112.5 bg-white"
        >
          <div className="w-full p-4 md:p-12 flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-5 text-center text-[#2D2F5B]">
              Create Account
            </h1>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#6B6F8D]">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full h-12 bg-[#F5F7FF] border-[#E4E7F2]
focus:border-[#4C5BD4] focus:ring-2 focus:ring-[#4C5BD4]/20 rounded-xl px-4 mt-1"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-[#6B6F8D]">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full h-12 bg-[#F5F7FF] border-[#E4E7F2]
focus:border-[#4C5BD4] focus:ring-2 focus:ring-[#4C5BD4]/20 rounded-xl px-4 mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#f39b03]
hover:bg-[#fc940d] rounded-xl font-bold text-white shadow-lg mt-2 hover:scale-105 transition-transform"
              >
                SIGN UP
              </button>

              <p className="text-sm text-slate-500 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#488c30] font-bold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signup;
