import React, { useState } from "react";
import Navbar from "../../components/necessary/Navbar";
import Sidebar from "../../components/necessary/Sidebar";

export default function Layout({ children, title }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#000f08] text-white relative">
      {/* Navbar with toggle */}
      <Navbar title={title} toggleSidebar={() => setIsOpen(!isOpen)} />
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />x
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Main content */}
      <main className="ml-0 md:ml-56 pt-14 p-4 md:p-8">{children}</main>
    </div>
  );
}
