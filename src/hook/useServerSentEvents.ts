import { useEffect, useState, useRef, useCallback } from "react";
import { useExchangeStore } from "@/store/exchangeStore";
import { saveMetricsToSupabase } from "@/lib/autoSaveMetrics";
import { useWalletAccess } from "./useWalletAccess";

interface SSEOptions {
  enabled?: boolean;
  reconnectInterval?: number;
}

export function useServerSentEvents(options: SSEOptions = {}) {
  const { enabled = true, reconnectInterval = 3000 } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;

  const setData = useExchangeStore((state) => state.setData);
  const setBBAData = useExchangeStore((state) => state.setBBAData);
  const setWalletAccess = useExchangeStore((state) => state.setWalletAccess);

  const walletAccess = useWalletAccess();

  // Update wallet access in store when it changes
  useEffect(() => {
    setWalletAccess({
      hasKOMAccess: walletAccess.hasKOMAccess,
      hasBBAAccess: walletAccess.hasBBAAccess,
      accessibleExchanges: walletAccess.accessibleExchanges,
    });
  }, [walletAccess, setWalletAccess]);

  const connect = useCallback(() => {
    if (
      !enabled ||
      !walletAccess.isConnected ||
      eventSourceRef.current?.readyState === EventSource.OPEN
    ) {
      return;
    }

    try {
      // Create SSE connection with wallet access parameters
      const params = new URLSearchParams({
        hasKOMAccess: walletAccess.hasKOMAccess.toString(),
        hasBBAAccess: walletAccess.hasBBAAccess.toString(),
      });

      const sseUrl = `/api/sse?${params}`;
      eventSourceRef.current = new EventSource(sseUrl);

      eventSourceRef.current.onopen = () => {
        console.log("SSE connected");
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      eventSourceRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (
            data.type === "kom_data" &&
            data.payload &&
            Array.isArray(data.payload)
          ) {
            console.log(
              "KOM Data received via SSE:",
              data.payload.length,
              "items"
            );
            setData(data.payload);

            // Auto-save KOM metrics
            try {
              await saveMetricsToSupabase(data.payload);
            } catch (saveError) {
              console.error("Failed to save KOM metrics:", saveError);
            }
          } else if (
            data.type === "bba_data" &&
            data.payload &&
            Array.isArray(data.payload)
          ) {
            console.log(
              "BBA Data received via SSE:",
              data.payload.length,
              "items"
            );
            setBBAData(data.payload);

            // Auto-save BBA metrics
            try {
              await saveMetricsToSupabase(data.payload);
            } catch (saveError) {
              console.error("Failed to save BBA metrics:", saveError);
            }
          }

          setLastUpdate(new Date());
        } catch (parseError) {
          console.error("Failed to parse SSE data:", parseError);
        }
      };

      eventSourceRef.current.addEventListener(
        "kom_data",
        async (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            if (data && Array.isArray(data)) {
              console.log(
                "KOM Data received via SSE event:",
                data.length,
                "items"
              );
              setData(data);

              try {
                await saveMetricsToSupabase(data);
              } catch (saveError) {
                console.error("Failed to save KOM metrics:", saveError);
              }
            }
            setLastUpdate(new Date());
          } catch (error) {
            console.error("Error handling KOM data event:", error);
          }
        }
      );

      eventSourceRef.current.addEventListener(
        "bba_data",
        async (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            if (data && Array.isArray(data)) {
              console.log(
                "BBA Data received via SSE event:",
                data.length,
                "items"
              );
              setBBAData(data);

              try {
                await saveMetricsToSupabase(data);
              } catch (saveError) {
                console.error("Failed to save BBA metrics:", saveError);
              }
            }
            setLastUpdate(new Date());
          } catch (error) {
            console.error("Error handling BBA data event:", error);
          }
        }
      );

      eventSourceRef.current.onerror = (error) => {
        console.error("SSE error:", error);
        setIsConnected(false);

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(
            reconnectInterval * Math.pow(2, reconnectAttempts.current),
            30000
          );
          reconnectAttempts.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `Attempting to reconnect SSE (${reconnectAttempts.current}/${maxReconnectAttempts})...`
            );
            connect();
          }, delay);
        } else {
          setError("Connection lost. Please refresh the page.");
        }
      };
    } catch (error) {
      console.error("Failed to create SSE connection:", error);
      setError("Failed to connect to Server-Sent Events");
    }
  }, [enabled, walletAccess, reconnectInterval, setData, setBBAData]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsConnected(false);
    reconnectAttempts.current = 0;
  }, []);

  // Connect when enabled and wallet is connected
  useEffect(() => {
    if (
      enabled &&
      walletAccess.isConnected &&
      (walletAccess.hasKOMAccess || walletAccess.hasBBAAccess)
    ) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [
    enabled,
    connect,
    disconnect,
    walletAccess.isConnected,
    walletAccess.hasKOMAccess,
    walletAccess.hasBBAAccess,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    error,
    lastUpdate,
    reconnect: connect,
    disconnect,
  };
}
