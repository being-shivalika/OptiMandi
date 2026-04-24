import React, { useState } from "react";

export default function FileUpload({ onFileSelect, disabled }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file && !disabled) {
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full max-w-md border-2 border-dashed rounded-xl p-6 text-center transition
        ${
          isDragging
            ? "border-green-500 bg-green-500/10"
            : "border-green-900/40 bg-[#0a1f1a]"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <p className="text-gray-400 text-sm mb-4">Drag & drop your file here</p>

      <label className="bg-[#E67E22] hover:bg-[#d3721f] text-white px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors">
        Browse File
        <input
          type="file"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
          accept=".csv"
        />
      </label>
    </div>
  );
}
