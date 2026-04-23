import LandingPage from "./pages/Landingpage";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/componentPage/Upload";
import Reports from "./pages/componentPage/Reports";
import Tasks from "./pages/componentPage/Tasks";
import Predictions from "./pages/componentPage/Prediction";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/predictions" element={<Predictions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
