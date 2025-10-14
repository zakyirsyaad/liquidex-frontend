import { NextRequest } from "next/server";

// Server-Sent Events endpoint
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hasKOMAccess = searchParams.get("hasKOMAccess") === "true";
  const hasBBAAccess = searchParams.get("hasBBAAccess") === "true";

  // Create SSE response
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({
        type: "connected",
        message: "SSE connection established",
        timestamp: new Date().toISOString(),
      })}\n\n`;

      controller.enqueue(encoder.encode(initialMessage));

      // Function to fetch and send data
      const fetchAndSendData = async (type: "kom" | "bba") => {
        try {
          const endpoint =
            type === "kom" ? "/api/liquidex" : "/api/liquidex/bba";
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            }${endpoint}`,
            {
              method: "GET",
              cache: "no-store",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const message = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(message));
          }
        } catch (error) {
          console.error(`Error fetching ${type} data:`, error);
          const errorMessage = `data: ${JSON.stringify({
            type: "error",
            message: `Failed to fetch ${type} data`,
            error: error instanceof Error ? error.message : "Unknown error",
          })}\n\n`;
          controller.enqueue(encoder.encode(errorMessage));
        }
      };

      // Initial data fetch
      if (hasKOMAccess) {
        fetchAndSendData("kom");
      }
      if (hasBBAAccess) {
        fetchAndSendData("bba");
      }

      // Set up periodic data fetching
      const interval = setInterval(async () => {
        if (hasKOMAccess) {
          await fetchAndSendData("kom");
        }
        if (hasBBAAccess) {
          await fetchAndSendData("bba");
        }
      }, 30000); // 30 seconds

      // Cleanup function
      const cleanup = () => {
        clearInterval(interval);
        controller.close();
      };

      // Handle client disconnect
      request.signal?.addEventListener("abort", cleanup);

      // Keep connection alive with periodic ping
      const pingInterval = setInterval(() => {
        const pingMessage = `data: ${JSON.stringify({
          type: "ping",
          timestamp: new Date().toISOString(),
        })}\n\n`;
        controller.enqueue(encoder.encode(pingMessage));
      }, 10000); // Ping every 10 seconds

      // Cleanup ping interval
      const originalCleanup = cleanup;
      const cleanupWithPing = () => {
        clearInterval(pingInterval);
        originalCleanup();
      };

      request.signal?.addEventListener("abort", cleanupWithPing);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}
