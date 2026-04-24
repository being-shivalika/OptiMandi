import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#000000] text-white font-sans">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-4 md:px-8 py-4 md:py-5 bg-[#0a3d2f2d] border-green-900 fixed w-full">
        <h1 className="text-xl md:text-2xl font-bold text-green-400 flex">
          <span>Opti</span>
          <span className="text-white">Mandi</span>
        </h1>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-green-400"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("how")}
            className="hover:text-green-400"
          >
            How it Works
          </button>
          <button
            onClick={() => scrollToSection("benefits")}
            className="hover:text-green-400"
          >
            Benefits
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="hover:text-green-400"
          >
            Contact
          </button>
        </div>
        <Link to="/login">
          <button className="bg-[#E67E22] hover:bg-[#e67d22ad] px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm">
            Get Started
          </button>
        </Link>
      </nav>

      {/*HERO  */}
      <section className="px-4 md:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-10 md:gap-12 items-center  ">
        {/* LEFT */}
        <div>
          <div className="border border-green-600 rounded-full flex items-center gap-2 px-3 py-1 w-fit mt-15">
            <i className="fa-solid fa-shop text-[#E67E22]"></i>
            <p className="text-gray-300 text-xs md:text-sm">
              Smart decisions for smarter Mandis
            </p>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight mt-6">
            Optimize your Mandi
            <br /> trade with
            <br />
            <span className="text-green-400">Precision Intelligence.</span>
          </h1>

          <p className="text-gray-400 mt-4 max-w-md text-sm md:text-base">
            Track arrivals, monitor prices, and avoid losses caused by
            oversupply — all in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/login">
              <button className="bg-[#E67E22] hover:bg-[#e67d22ad] px-5 py-2 md:px-6 md:py-3 rounded-lg text-sm">
                Start Tracking
              </button>
            </Link>
            <Link to="/signup">
              <button className="border border-[#E67E22] hover:bg-[#1c3f0ead] px-5 py-2 md:px-6 md:py-3 rounded-lg text-sm">
                Register Now
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-[#112B24] p-4 md:p-6 rounded-xl border border-green-900">
          <img
            src="Heros.png"
            alt="Mandi Dashboard Preview"
            className="w-full rounded-lg transition-transform transform hover:scale-105"
          />
        </div>
      </section>

      {/* FEATURES  */}
      <section
        id="features"
        className="px-4 md:px-8 py-12 md:py-16 border-t border-green-900 flex flex-col items-center justify-center"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-8 md:mb-10 text-center">
          Everything You Need to Track the Market
        </h2>

        <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
          {[
            [
              "fa-file-circle-plus",
              "Upload Mandi Data",
              "Easily upload daily data using CSV or manual entry.",
            ],
            [
              "fa-money-bill-trend-up",
              "Track Price Trends",
              "See how prices are changing over time with simple charts.",
            ],
            [
              "fa-algolia",
              "Detect Oversupply",
              "Identify when too much stock is entering the market.",
            ],
            [
              "fa-newspaper",
              "Daily Reports",
              "Get a clear summary of price movement and market conditions.",
            ],
          ].map(([icon, title, desc], i) => (
            <div
              key={i}
              className="p-4 md:p-5 rounded-xl border border-green-600 bg-[#0B1F1A] text-center w-full sm:w-[45%] md:w-50 transition-transform transform hover:scale-105 hover:border-yellow-400 hover:border-2"
            >
              <i
                className={`fa-solid ${icon} text-[#E67E22] text-2xl md:text-3xl mb-3`}
              ></i>
              <p className="text-lg md:text-xl font-bold mt-2">{title}</p>
              <p className="text-gray-300 mt-2 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/*  HOW IT WORKS */}
      <section
        id="how"
        className="px-4 md:px-8 py-12 md:py-16 border-t border-green-900"
      >
        <div className="max-w-3xl mx-auto justify-center items-center flex flex-col">
          <h2 className="text-xl md:text-2xl font-semibold mb-10">
            From Data to Decisions in 3 Steps
          </h2>

          <div className="relative border-l border-green-800 pl-6 space-y-10">
            {/* Step 1 */}
            <div className="relative p-2 pl-10 transition-transform transform hover:scale-105">
              <div className="absolute -left-3 top-1 w-5 h-5 bg-[#0F1C17] border-2 border-green-500 rounded-full "></div>

              <h3 className="text-lg font-semibold">Step 1: Upload Data</h3>
              <p className="text-gray-400 text-sm mt-1">
                Add daily mandi data using CSV or manual input.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative  p-2 pl-10 transition-transform transform hover:scale-105">
              <div className="absolute -left-3 top-1 w-5 h-5 bg-[#0F1C17] border-2 border-green-500 rounded-full"></div>

              <h3 className="text-lg font-semibold">
                Step 2: System Processes Data
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                The system analyzes arrivals and price trends.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-2 pl-10 transition-transform transform hover:scale-105">
              <div className="absolute -left-3 top-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-black">✓</span>
              </div>

              <h3 className="text-lg font-semibold">Step 3: Get Insights</h3>
              <p className="text-gray-400 text-sm mt-1">
                View trends, risks, and predictions to make better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS  */}
      <section
        id="benefits"
        className="px-4 md:px-8 py-12 md:py-16 border-t border-green-900"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-8 md:mb-10 text-center">
          Make Smarter Mandi Decisions
        </h2>

        <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
          {[
            [
              "fa-money-bill-trend-up",
              "Avoid Price Drops",
              " Know when oversupply can cause prices to fall.",
            ],
            [
              "fa-solid fa-bolt-lightning",
              "Make Faster Decisions.",
              "Access important data without manual tracking.",
            ],
            [
              "fa-solid fa-brain",
              "Reduce dependency on guesswork.",
              "Use data instead of assumptions.",
            ],
          ].map(([icon, title, desc], i) => (
            <div
              key={i}
              className="p-4 md:p-5 rounded-xl border border-green-900 bg-[#0B1F1A] text-center w-full sm:w-[45%] md:w-50 transition-transform transform hover:scale-105  hover:border-yellow-400 hover:border-2"
            >
              <i
                className={`fa-solid ${icon} text-[#E67E22] text-2xl md:text-3xl mb-3`}
              ></i>
              <p className="text-lg md:text-xl font-bold mt-2">{title}</p>
              <p className="text-gray-300 mt-2 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="px-4 md:px-8 py-12 md:py-16 border-t border-green-900 text-center"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
          Start Tracking Today
        </h2>

        <p className="text-gray-400 mb-6 text-sm md:text-base">
          Want to use OptiMandi? Get started and track your mandi data today.
        </p>

        <button className="bg-[#E67E22] hover:bg-[#e67d22ad] px-5 py-2 md:px-6 md:py-3 rounded-lg text-sm transition-transform transform hover:scale-105  hover:border-yellow-400 hover:border-2">
          Contact Us
        </button>
      </section>

      {/* FOOTER  */}
      <footer className="text-center text-gray-500 py-4 md:py-6 border-t border-green-900 text-xs md:text-sm">
        © 2026 OptiMandi. Built for real mandi decisions.
      </footer>
    </div>
  );
}
