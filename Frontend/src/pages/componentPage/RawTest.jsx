import React, { useState } from "react";

export default function RawTest() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    try {
      const res = await fetch("https://optimandi.onrender.com/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: JSON.parse(input),
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <textarea
        rows="10"
        placeholder="Paste JSON here..."
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleAnalyze}>Analyze</button>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
