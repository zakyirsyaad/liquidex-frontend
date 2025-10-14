import { useEffect, useState, useRef, useCallback } from "react";
import { useExchangeStore, ExchangeData } from "@/store/exchangeStore";
import { saveMetricsToSupabase } from "@/lib/autoSaveMetrics";
import { useWalletAccess } from "./useWalletAccess";

interface WebSocketMessage {
  type: "kom_data" | "bba_data" | "error" | "ping";
  data?: ExchangeData[];
  error?: string;
}

export function useWebSocket(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

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
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/ws`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Send wallet access info to server
        wsRef.current?.send(
          JSON.stringify({
            type: "wallet_access",
            data: {
              hasKOMAccess: walletAccess.hasKOMAccess,
              hasBBAAccess: walletAccess.hasBBAAccess,
              accessibleExchanges: walletAccess.accessibleExchanges,
            },
          })
        );
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case "kom_data":
              if (message.data && Array.isArray(message.data)) {
                console.log(
                  "KOM Data received via WebSocket:",
                  message.data.length,
                  "items"
                );
                setData(message.data);

                // Auto-save KOM metrics
                try {
                  await saveMetricsToSupabase(message.data);
                } catch (saveError) {
                  console.error("Failed to save KOM metrics:", saveError);
                }
              }
              break;

            case "bba_data":
              if (message.data && Array.isArray(message.data)) {
                console.log(
                  "BBA Data received via WebSocket:",
                  message.data.length,
                  "items"
                );
                setBBAData(message.data);

                // Auto-save BBA metrics
                try {
                  await saveMetricsToSupabase(message.data);
                } catch (saveError) {
                  console.error("Failed to save BBA metrics:", saveError);
                }
              }
              break;

            case "error":
              console.error("WebSocket error from server:", message.error);
              setError(message.error || "Unknown server error");
              break;

            case "ping":
              // Respond to ping with pong
              wsRef.current?.send(JSON.stringify({ type: "pong" }));
              break;
          }

          setLastUpdate(new Date());
        } catch (parseError) {
          console.error("Failed to parse WebSocket message:", parseError);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000; // 1s, 2s, 4s, 8s, 16s
          reconnectAttempts.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`
            );
            connect();
          }, delay);
        } else {
          setError("Connection lost. Please refresh the page.");
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection error");
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setError("Failed to connect to WebSocket");
    }
  }, [enabled, walletAccess, setData, setBBAData]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
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
