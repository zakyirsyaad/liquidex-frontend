import React from "react";

interface PercentageIndicatorProps {
  value: number;
  label: string;
  className?: string;
}

export function PercentageIndicator({
  value,
  label,
  className = "",
}: PercentageIndicatorProps) {
  const isPositive = value > 0;
  const color = isPositive ? "text-green-500" : "text-red-500";
  const icon = isPositive ? "↗" : "↘";

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={color}>{icon}</span>
      <span className={color}>{Math.abs(value).toFixed(2)}%</span>
      <span className="text-gray-500">{label}</span>
    </div>
  );
}
