"use client";

import React from "react";
import { RealTimeMethod } from "@/hook/useRealTimeDataFactory";

interface RealTimeMethodSelectorProps {
  currentMethod: RealTimeMethod;
  onMethodChange: (method: RealTimeMethod) => void;
  disabled?: boolean;
}

const methodDescriptions: Record<
  RealTimeMethod,
  { name: string; description: string; efficiency: string }
> = {
  polling: {
    name: "Basic Polling",
    description: "Traditional HTTP polling every 30 seconds",
    efficiency: "Low efficiency, high server load",
  },
  "optimized-polling": {
    name: "Smart Polling",
    description: "Adaptive polling with exponential backoff",
    efficiency: "Medium efficiency, reduced server load",
  },
  sse: {
    name: "Server-Sent Events",
    description: "Real-time push notifications from server",
    efficiency: "High efficiency, low latency",
  },
  websocket: {
    name: "WebSocket",
    description: "Full-duplex real-time communication",
    efficiency: "Highest efficiency, lowest latency",
  },
};

export default function RealTimeMethodSelector({
  currentMethod,
  onMethodChange,
  disabled = false,
}: RealTimeMethodSelectorProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Real-time Method
      </label>
      <select
        value={currentMethod}
        onChange={(e) => onMethodChange(e.target.value as RealTimeMethod)}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {Object.entries(methodDescriptions).map(([key, method]) => (
          <option key={key} value={key}>
            {method.name}
          </option>
        ))}
      </select>
      <div className="text-xs text-gray-500">
        <p className="font-medium">
          {methodDescriptions[currentMethod].description}
        </p>
        <p className="text-gray-400">
          {methodDescriptions[currentMethod].efficiency}
        </p>
      </div>
    </div>
  );
}
