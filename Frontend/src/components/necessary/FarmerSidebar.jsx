import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const FarmerSidebar = () => {
  const location = useLocation();
  const { userData, setIsLoggedin } = useContext(AuthContext);

  const navItems = [
    { name: "Mandi Updates", path: "/farmer-dashboard", icon: "fa-bullhorn" },
    { name: "Book a Slot", path: "/farmer-slots", icon: "fa-calendar-check" },
    { name: "Submit Complaint", path: "/farmer-complaints", icon: "fa-envelope-open-text" },
    { name: "Kisan Sahayak (AI)", path: "/farmer-chat", icon: "fa-robot" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedin(false);
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0B1F1A] border-r border-green-900/50 flex flex-col justify-between hidden md:flex">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-400 mb-8 flex items-center gap-2">
          <span>Opti</span>
          <span className="text-white">Mandi</span>
        </h2>
        
        <p className="text-xs text-gray-500 font-bold mb-4 uppercase">Farmer Portal</p>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                location.pathname === item.path
                  ? "bg-green-600/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-900/20"
                  : "text-gray-400 hover:bg-[#112B24] hover:text-white"
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-6 border-t border-green-900/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#E67E22] flex items-center justify-center text-white font-bold">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : "F"}
          </div>
          <div>
            <p className="text-sm font-bold text-white truncate max-w-[120px]">{userData?.name || "Farmer"}</p>
            <p className="text-xs text-gray-400">Farmer Account</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-[#112B24] hover:bg-red-900/40 text-red-400 hover:text-red-300 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-red-900/20"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default FarmerSidebar;
