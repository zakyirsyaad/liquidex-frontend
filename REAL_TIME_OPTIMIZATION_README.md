# Real-time Data Fetching Optimization

## Masalah yang Diperbaiki

Sebelum optimasi, aplikasi menggunakan polling sederhana setiap 30 detik yang menyebabkan:

- Banyak log debug yang mengisi console
- Fetching berulang meskipun data tidak berubah
- Beban server yang tinggi
- Penggunaan bandwidth yang tidak efisien

## Alternatif yang Tersedia

### 1. **Optimized Polling** (Default - Recommended)

```typescript
import { useRealTimeDataFactory } from "@/hook/useRealTimeDataFactory";

const { isLoading, lastUpdate, error, currentInterval } =
  useRealTimeDataFactory({
    method: "optimized-polling",
    baseInterval: 30000,
    adaptiveInterval: true,
  });
```

**Keunggulan:**

- ✅ Adaptive interval berdasarkan perubahan data
- ✅ Exponential backoff saat data tidak berubah
- ✅ Rate limiting untuk mencegah request berlebihan
- ✅ Data hashing untuk mendeteksi perubahan
- ✅ Kompatibel dengan kode existing

### 2. **Server-Sent Events (SSE)**

```typescript
const { isConnected, error, lastUpdate } = useRealTimeDataFactory({
  method: "sse",
});
```

**Keunggulan:**

- ✅ Real-time push dari server
- ✅ Otomatis reconnect dengan backoff
- ✅ Lebih efisien dari polling
- ✅ Built-in browser support

### 3. **WebSocket**

```typescript
const { isConnected, error, lastUpdate } = useRealTimeDataFactory({
  method: "websocket",
});
```

**Keunggulan:**

- ✅ Full-duplex communication
- ✅ Lowest latency
- ✅ Most efficient
- ✅ Real-time bidirectional updates

### 4. **Basic Polling** (Legacy)

```typescript
const { isLoading, lastUpdate, error } = useRealTimeDataFactory({
  method: "polling",
  interval: 30000,
});
```

## Cara Menggunakan

### Opsi 1: Menggunakan Factory Hook (Recommended)

```typescript
import { useRealTimeDataFactory } from "@/hook/useRealTimeDataFactory";

function MyComponent() {
  const { isLoading, lastUpdate, error } = useRealTimeDataFactory({
    method: "optimized-polling", // atau 'sse', 'websocket', 'polling'
    baseInterval: 30000,
    adaptiveInterval: true,
  });

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {lastUpdate && <div>Last update: {lastUpdate.toLocaleTimeString()}</div>}
    </div>
  );
}
```

### Opsi 2: Menggunakan Hook Langsung

```typescript
import { useOptimizedRealTimeData } from "@/hook/useOptimizedRealTimeData";

function MyComponent() {
  const { isLoading, lastUpdate, error, currentInterval } =
    useOptimizedRealTimeData({
      baseInterval: 30000,
      maxInterval: 120000,
      minInterval: 10000,
      adaptiveInterval: true,
    });

  return (
    <div>
      <div>Current interval: {currentInterval}ms</div>
      {/* ... */}
    </div>
  );
}
```

## Implementasi Server-Side

### SSE Endpoint

```typescript
// src/app/api/sse/route.ts
export async function GET(request: NextRequest) {
  // Stream data dengan Server-Sent Events
  // Otomatis reconnect dan error handling
}
```

### WebSocket Endpoint

```typescript
// src/app/api/ws/route.ts
export async function GET(request: NextRequest) {
  // WebSocket connection handler
  // Full-duplex real-time communication
}
```

## Monitoring dan Debugging

### Adaptive Interval Logging

```typescript
// Console akan menampilkan:
// "Adaptive interval updated: 45000ms"
// "KOM Data changed - updating"
// "BBA Data unchanged - skipping update"
```

### Connection Status

```typescript
const { isConnected, error, lastUpdate } = useServerSentEvents();

console.log("SSE Connected:", isConnected);
console.log("Last Update:", lastUpdate);
console.log("Error:", error);
```

## Performance Comparison

| Method            | Latency  | Server Load | Browser Support | Implementation |
| ----------------- | -------- | ----------- | --------------- | -------------- |
| Basic Polling     | High     | Very High   | Excellent       | Simple         |
| Optimized Polling | Medium   | Medium      | Excellent       | Medium         |
| SSE               | Low      | Low         | Excellent       | Medium         |
| WebSocket         | Very Low | Very Low    | Excellent       | Complex        |

## Rekomendasi

1. **Mulai dengan Optimized Polling** - Drop-in replacement yang memberikan peningkatan signifikan
2. **Upgrade ke SSE** jika memerlukan real-time yang lebih responsif
3. **Gunakan WebSocket** untuk aplikasi yang memerlukan bidirectional communication
4. **Monitor performance** dan sesuaikan interval berdasarkan kebutuhan

## Troubleshooting

### Console Logs Berlebihan

- Gunakan `optimized-polling` untuk mengurangi log debug
- SSE dan WebSocket menghasilkan log yang lebih bersih

### Connection Issues

- SSE dan WebSocket memiliki auto-reconnect built-in
- Optimized polling memiliki rate limiting untuk mencegah spam requests

### Performance Issues

- Sesuaikan `baseInterval`, `maxInterval`, dan `minInterval`
- Gunakan `adaptiveInterval: false` untuk polling interval tetap
- Monitor `currentInterval` untuk melihat adaptasi interval

## Migration Guide

### Dari Basic Polling ke Optimized Polling

```typescript
// Before
const { isLoading, lastUpdate, error } = useRealTimeData({
  interval: 30000,
});

// After
const { isLoading, lastUpdate, error, currentInterval } =
  useRealTimeDataFactory({
    method: "optimized-polling",
    baseInterval: 30000,
    adaptiveInterval: true,
  });
```

### Ke Server-Sent Events

```typescript
// Setup SSE endpoint di server
// Kemudian ganti hook
const { isConnected, error, lastUpdate } = useRealTimeDataFactory({
  method: "sse",
});
```
