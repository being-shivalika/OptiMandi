import React from "react";

const SignalBadge = ({ signal }) => {
  if (!signal) return null;

  const config = {
    buy: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/30",
      icon: "fa-arrow-trend-up",
    },
    sell: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
      icon: "fa-arrow-trend-down",
    },
    hold: {
      bg: "bg-gray-500/10",
      text: "text-gray-300",
      border: "border-gray-500/30",
      icon: "fa-minus",
    },
  };

  const style = config[signal.action] || config.hold;

  return (
    <div
      className={`flex items-center justify-between p-5 rounded-2xl border ${style.bg} ${style.border}`}
    >
      <div>
        <p className="text-xs uppercase text-gray-400 mb-1">
          Recommended Action
        </p>

        <h2 className={`text-2xl font-bold ${style.text}`}>
          {signal.action.toUpperCase()}
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Confidence: {signal.confidence}
        </p>
      </div>

      <div className={`text-3xl ${style.text}`}>
        <i className={`fa-solid ${style.icon}`}></i>
      </div>
    </div>
  );
};

export default SignalBadge;
