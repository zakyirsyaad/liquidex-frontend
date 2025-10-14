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

  // Always call all hooks to maintain hook order
  const pollingResult = useRealTimeData(restOptions);
  const optimizedResult = useOptimizedRealTimeData(restOptions);
  const sseResult = useServerSentEvents(restOptions);
  const wsResult = useWebSocket(restOptions);

  switch (method) {
    case "polling":
      return pollingResult;

    case "optimized-polling":
      return optimizedResult;

    case "sse":
      return sseResult;

    case "websocket":
      return wsResult;

    default:
      console.warn(
        `Unknown real-time method: ${method}, falling back to optimized polling`
      );
      return optimizedResult;
  }
}

// Export individual hooks for direct use
export {
  useRealTimeData,
  useOptimizedRealTimeData,
  useServerSentEvents,
  useWebSocket,
};
