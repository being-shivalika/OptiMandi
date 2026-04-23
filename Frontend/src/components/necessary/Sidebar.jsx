import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const linkStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-[#153b31]";

  const activeStyle = "bg-[#153b31] text-green-400";

  return (
    <div
      className={`
        fixed top-14 left-0 h-[calc(100vh-56px)] w-56 bg-[#072e2349] 
        border-r border-green-900 p-4 z-50
        transform transition-transform duration-300

        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:block
      `}
    >
      {/* Close button (mobile only) */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-300 text-lg"
        >
          ✕
        </button>
      </div>

      {/* SECTION TITLE */}
      <p className="text-xs text-gray-400 mb-4">MENU</p>

      {/* LINKS */}
      <div className="flex flex-col gap-2">
        <NavLink
          to="/dashboard"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          <i className="fa-solid fa-chart-line"></i>
          Dashboard
        </NavLink>

        <NavLink
          to="/upload"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          <i className="fa-solid fa-upload"></i>
          Upload Data
        </NavLink>

        <NavLink
          to="/reports"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          <i className="fa-solid fa-file-lines"></i>
          Reports
        </NavLink>

        <NavLink
          to="/tasks"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          <i className="fa-solid fa-chart-area"></i>
          Tasks
        </NavLink>

        <NavLink
          to="/predictions"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          <i className="fa-solid fa-chart-area"></i>
          Predictions
        </NavLink>
      </div>
    </div>
  );
}
