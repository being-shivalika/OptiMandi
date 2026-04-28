import React from "react";

const CustomDot = (props) => {
  const { cx, cy, payload } = props;

  if (!payload.spike) {
    return <circle cx={cx} cy={cy} r={3} fill="#22c55e" />;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill="#ef4444"
      stroke="#fff"
      strokeWidth={2}
    />
  );
};

export default CustomDot;
