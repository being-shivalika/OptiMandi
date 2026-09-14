import LandingPage from "./pages/Landingpage";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/componentPage/Upload";
import Reports from "./pages/componentPage/Reports";
import Tasks from "./pages/componentPage/Tasks";
import Predictions from "./pages/componentPage/Prediction";
import ManageSlots from "./pages/componentPage/ManageSlots";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import FarmerDashboard from "./pages/componentPage/FarmerDashboard";
import FarmerSlots from "./pages/componentPage/FarmerSlots";
import FarmerChat from "./pages/componentPage/FarmerChat";
import FarmerComplaints from "./pages/componentPage/FarmerComplaints";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer-slots" element={<FarmerSlots />} />
        <Route path="/farmer-chat" element={<FarmerChat />} />
        <Route path="/farmer-complaints" element={<FarmerComplaints />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/manage-slots" element={<ManageSlots />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </BrowserRouter>
  );
}

export default App;
