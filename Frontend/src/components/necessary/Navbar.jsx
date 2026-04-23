import React from "react";

export default function Navbar({ title, toggleSidebar }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#072e2349] border-b border-green-900">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-xl text-gray-300"
            onClick={toggleSidebar}
          >
            ☰
          </button>

          <h1 className="text-lg md:text-xl font-bold text-green-400">
            Opti<span className="text-white">Mandi</span>
          </h1>
        </div>

        <p className="text-sm md:text-base text-gray-300">{title}</p>
      </div>
    </div>
  );
}
