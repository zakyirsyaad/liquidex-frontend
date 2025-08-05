import React from "react";

interface RealTimeIndicatorProps {
  isEnabled: boolean;
  isLoading: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export function RealTimeIndicator({
  isEnabled,
  isLoading,
  lastUpdate,
  error,
}: RealTimeIndicatorProps) {
  const getStatusColor = () => {
    if (error) return "bg-red-500";
    if (isLoading) return "bg-yellow-500";
    if (isEnabled) return "bg-green-500";
    return "bg-gray-500";
  };

  const getStatusText = () => {
    if (error) return "Error";
    if (isLoading) return "Updating...";
    if (isEnabled) return "Live";
    return "Offline";
  };

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
      <div className="flex items-center gap-1">
        <div
          className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}
        />
        <span className="text-gray-300 font-medium">{getStatusText()}</span>
      </div>

      {lastUpdate && (
        <span className="text-gray-400 text-xs">
          {formatLastUpdate(lastUpdate)}
        </span>
      )}

      {error && (
        <span className="text-red-400 text-xs" title={error}>
          ⚠️
        </span>
      )}
    </div>
  );
}
