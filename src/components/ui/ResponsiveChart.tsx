import React from "react";
import { Card } from "./card";

interface ResponsiveChartProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveChart({
  title,
  children,
  className = "",
}: ResponsiveChartProps) {
  return (
    <Card className={`p-4 md:p-6 ${className}`}>
      <h1 className="text-lg md:text-xl font-medium mb-4">{title}</h1>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px] md:min-w-0">{children}</div>
      </div>
    </Card>
  );
}
