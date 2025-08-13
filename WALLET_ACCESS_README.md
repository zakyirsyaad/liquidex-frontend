# Wallet Access Control untuk Liquidex

Fitur ini memungkinkan Anda membatasi akses data berdasarkan wallet address yang terhubung. Setiap wallet hanya bisa melihat data exchange yang sudah diizinkan.

## Cara Kerja

1. **Wallet KOM Owner**: Hanya bisa melihat data KOM/USDT
2. **Wallet BBA Owner**: Hanya bisa melihat data BBA/USDT
3. **Wallet dengan Akses Keduanya**: Bisa melihat data KOM dan BBA
4. **Wallet Tanpa Akses**: Tidak bisa melihat data apapun

## Konfigurasi

### 1. Buat file `.env.local` di root project

```bash
# Wallet Access Control Configuration
# Tambahkan wallet address yang punya akses ke data KOM
NEXT_PUBLIC_KOM_OWNER_WALLETS=0x1234567890123456789012345678901234567890,0x0987654321098765432109876543210987654321

# Tambahkan wallet address yang punya akses ke data BBA
NEXT_PUBLIC_BBA_OWNER_WALLETS=0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,0xfedcbafedcbafedcbafedcbafedcbafedc
```

### 2. Format Wallet Address

- Gunakan format Ethereum address (0x...)
- Pisahkan multiple address dengan koma
- Tidak ada spasi setelah koma
- Address case-insensitive

### 3. Contoh Konfigurasi

```bash
# Satu wallet untuk KOM
NEXT_PUBLIC_KOM_OWNER_WALLETS=0x1234567890123456789012345678901234567890

# Dua wallet untuk BBA
NEXT_PUBLIC_BBA_OWNER_WALLETS=0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,0xfedcbafedcbafedcbafedcbafedcbafedc

# Satu wallet punya akses keduanya
NEXT_PUBLIC_KOM_OWNER_WALLETS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_BBA_OWNER_WALLETS=0x1234567890123456789012345678901234567890
```

## Fitur

### 1. Auto-Detection

- Sistem otomatis mendeteksi wallet yang terhubung
- Mengecek apakah wallet punya akses ke KOM, BBA, atau keduanya

### 2. Data Filtering

- Hanya data yang diizinkan yang di-fetch dari API
- Hanya data yang diizinkan yang ditampilkan di dashboard

### 3. UI Adaptation

- Tombol data source (KOM/BBA) hanya muncul sesuai akses
- Pesan error yang informatif untuk wallet tanpa akses

### 4. Real-time Updates

- Data tetap real-time untuk wallet yang punya akses
- Tidak ada polling untuk wallet tanpa akses

## Keamanan

⚠️ **PENTING**: Konfigurasi ini hanya untuk frontend. Untuk keamanan yang lebih baik:

1. **Tambahkan validasi di backend API**
2. **Gunakan middleware authentication**
3. **Implementasikan rate limiting**
4. **Log semua akses untuk audit**

## Testing

### 1. Test dengan Wallet KOM

```bash
# Set environment variable
NEXT_PUBLIC_KOM_OWNER_WALLETS=0xYOUR_WALLET_ADDRESS

# Connect wallet dan lihat hanya data KOM
```

### 2. Test dengan Wallet BBA

```bash
# Set environment variable
NEXT_PUBLIC_BBA_OWNER_WALLETS=0xYOUR_WALLET_ADDRESS

# Connect wallet dan lihat hanya data BBA
```

### 3. Test dengan Wallet Keduanya

```bash
# Set kedua environment variable dengan wallet yang sama
NEXT_PUBLIC_KOM_OWNER_WALLETS=0xYOUR_WALLET_ADDRESS
NEXT_PUBLIC_BBA_OWNER_WALLETS=0xYOUR_WALLET_ADDRESS

# Connect wallet dan lihat data KOM dan BBA
```

## Troubleshooting

### Wallet tidak terdeteksi

- Pastikan wallet terhubung dengan benar
- Cek console untuk error
- Restart aplikasi setelah mengubah environment variables

### Akses tidak berfungsi

- Pastikan format wallet address benar
- Cek environment variables sudah diset
- Restart development server

### Data tidak muncul

- Cek apakah wallet punya akses
- Cek network tab untuk API calls
- Cek console untuk error messages

## Development

### Struktur File

```
src/
├── lib/config/WalletConfig.tsx    # Konfigurasi wallet owners
├── hook/useWalletAccess.ts        # Hook untuk cek akses wallet
├── store/exchangeStore.ts         # Store dengan access control
├── components/layout/
│   ├── AccessControl.tsx          # Komponen kontrol akses
│   ├── Header.tsx                 # Header dengan tombol terbatas
│   └── dashboard/Dashboard.tsx    # Dashboard dengan access control
```

### Menambah Exchange Baru

1. Tambahkan ke `WALLET_OWNERS` di `WalletConfig.tsx`
2. Update types di `type.ts`
3. Tambahkan logic di `useRealTimeData.ts`
4. Update UI components

## Support

Jika ada masalah atau pertanyaan:

1. Cek console browser untuk error
2. Cek network tab untuk API calls
3. Pastikan environment variables sudah benar
4. Restart development server
