import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import DataProvider from "./context/DataProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AuthContextProvider>
  </StrictMode>,
);
