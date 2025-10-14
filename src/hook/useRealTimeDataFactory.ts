import { useRealTimeData } from "./useRealTimeData";
import { useOptimizedRealTimeData } from "./useOptimizedRealTimeData";
import { useServerSentEvents } from "./useServerSentEvents";
import { useWebSocket } from "./useWebSocket";

export type RealTimeMethod =
  | "polling"
  | "optimized-polling"
  | "sse"
  | "websocket";

interface RealTimeDataFactoryOptions {
  method?: RealTimeMethod;
  interval?: number;
  baseInterval?: number;
  maxInterval?: number;
  minInterval?: number;
  enabled?: boolean;
  adaptiveInterval?: boolean;
}

export function useRealTimeDataFactory(
  options: RealTimeDataFactoryOptions = {}
) {
  const { method = "optimized-polling", ...restOptions } = options;

  switch (method) {
    case "polling":
      return useRealTimeData(restOptions);

    case "optimized-polling":
      return useOptimizedRealTimeData(restOptions);

    case "sse":
      return useServerSentEvents(restOptions);

    case "websocket":
      return useWebSocket(restOptions);

    default:
      console.warn(
        `Unknown real-time method: ${method}, falling back to optimized polling`
      );
      return useOptimizedRealTimeData(restOptions);
  }
}

// Export individual hooks for direct use
export {
  useRealTimeData,
  useOptimizedRealTimeData,
  useServerSentEvents,
  useWebSocket,
};
