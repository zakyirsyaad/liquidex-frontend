# Liquidex Frontend

A comprehensive cryptocurrency trading dashboard built with Next.js that provides real-time market data, wallet-based access control, and advanced analytics for KOM and BBA trading pairs.

## 🚀 Features

### 📊 Real-time Dashboard

- **Live Market Data**: Real-time updates every 30 seconds
- **Multiple Data Sources**: Support for both KOM and BBA trading data
- **Interactive Charts**: Advanced visualizations using Recharts
- **Responsive Design**: Optimized for desktop and mobile devices

### 🔐 Wallet Access Control

- **Secure Authentication**: Wallet-based access using RainbowKit and Wagmi
- **Role-based Data Access**: Different access levels for KOM and BBA data
- **Multi-chain Support**: Ethereum, Polygon, Optimism, Arbitrum, and Base

### 📈 Advanced Analytics

- **Market Depth Analysis**: Bid/ask depth visualization
- **Volume Statistics**: 24-hour volume tracking and trends
- **Spread Analysis**: Real-time spread monitoring
- **Balance Tracking**: USDT and token balance monitoring
- **Price Indicators**: Current price, percentage changes, and historical data

### 🗄️ Data Management

- **Automatic Data Persistence**: Real-time data saving to Supabase
- **Historical Metrics**: 24-hour historical data tracking
- **Data Source Switching**: Seamless switching between KOM and BBA data

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **Web3**: Wagmi, RainbowKit, Viem
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Charts**: Recharts
- **Database**: Supabase
- **Authentication**: Wallet-based (Web3)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd liquidex-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```bash
   # GitHub API Token (required for data fetching)
   GITHUB_TOKEN=your_github_token_here

   # Supabase Configuration (required for data persistence)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Wallet Access Control (optional)
   NEXT_PUBLIC_KOM_OWNER_WALLETS=0x1234...,0x5678...
   NEXT_PUBLIC_BBA_OWNER_WALLETS=0xabcd...,0xefgh...
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Wallet Access Control

The application supports role-based access control through wallet addresses:

- **KOM Owners**: Can only access KOM/USDT data
- **BBA Owners**: Can only access BBA/USDT data
- **Dual Access**: Can access both KOM and BBA data
- **No Access**: Cannot view any data

Configure wallet access in your `.env.local`:

```bash
# KOM data access
NEXT_PUBLIC_KOM_OWNER_WALLETS=0x1234567890123456789012345678901234567890,0x0987654321098765432109876543210987654321

# BBA data access
NEXT_PUBLIC_BBA_OWNER_WALLETS=0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,0xfedcbafedcbafedcbafedcbafedc
```

### Data Sources

The application fetches data from two sources:

- **KOM Data**: `/api/liquidex` - KOM/USDT trading data
- **BBA Data**: `/api/liquidex/bba` - BBA/USDT trading data

Both sources pull data from GitHub repositories and require a valid `GITHUB_TOKEN`.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── liquidex/      # Data fetching endpoints
│   │   └── metrics/       # Metrics and history endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── charts/    # Chart components
│   │   │   └── indicators/# Market indicators
│   │   ├── AccessControl.tsx
│   │   ├── Header.tsx
│   │   └── SignIn.tsx
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
├── hook/                  # Custom hooks
│   ├── getBBA.tsx         # BBA data fetching
│   ├── getLiquidex.tsx    # KOM data fetching
│   ├── useMetrics.ts      # Metrics management
│   ├── useRealTimeData.ts # Real-time data updates
│   └── useWalletAccess.ts # Wallet access control
├── lib/                   # Utility libraries
│   ├── config/            # Configuration files
│   ├── types/             # TypeScript type definitions
│   ├── autoSaveMetrics.ts # Automatic data saving
│   ├── percentageCalculator.ts
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Utility functions
└── store/                 # State management
    └── exchangeStore.ts   # Exchange data store
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📊 API Endpoints

### Data Endpoints

- `GET /api/liquidex` - Fetch KOM trading data
- `GET /api/liquidex/bba` - Fetch BBA trading data

### Metrics Endpoints

- `GET /api/metrics/history` - Get historical metrics
- `POST /api/metrics/save` - Save current metrics

### Authentication Endpoints

- `POST /api/auth/login` - Wallet authentication
- `GET /api/auth/validate` - Validate wallet access

## 🔒 Security Features

- **Wallet-based Authentication**: Secure Web3 authentication
- **Access Control**: Role-based data access
- **Environment Variables**: Sensitive data stored securely
- **API Rate Limiting**: Built-in protection against abuse
- **Data Validation**: Input validation and sanitization

## 📈 Data Types

### LiquidexData

```typescript
{
  exchange: string;
  pair: string;
  generated_volume: number;
  balance_usdt: number;
  balance_token: number;
  deployed_buy: number;
  deployed_sell: number;
  estimated_fee: number;
  internal_pricing: number;
  mm_depth_plus_2: number;
  mm_depth_minus_2: number;
  organic_depth_plus_2: number;
  organic_depth_sell_2: number;
  spread: number;
  avg_24h_price: number;
  volume_24h_statistic: string[];
  spread_24h_statistic: number[];
  // ... more fields
}
```

### ExchangeMetric

```typescript
{
  id?: number;
  exchange: string;
  pair: string;
  current_price: number;
  last_vol_24h: number;
  mm_depth_plus_2: number;
  mm_depth_minus_2: number;
  organic_depth_plus_2: number;
  organic_depth_minus_2: number;
  created_at?: string;
}
```

## 🎨 UI Components

### Dashboard Components

- **Indicators**: Current price, spread, volume, and balance indicators
- **Charts**: Interactive charts for spread, volume, depth, and balance analysis
- **Amounts**: Real-time amount displays
- **Access Control**: Wallet access status and data source selection

### Reusable Components

- **Button**: Customizable button component
- **Card**: Flexible card layout component
- **Chart**: Wrapper for Recharts components
- **PercentageIndicator**: Animated percentage change indicator
- **RealTimeIndicator**: Real-time data status indicator

## 🔄 Real-time Updates

The application provides real-time updates through:

- **30-second polling** for live data
- **Automatic data persistence** to Supabase
- **Real-time UI updates** without page refresh
- **Error handling** and retry mechanisms

## 🌐 Supported Networks

- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:

- Desktop (1920x1080 and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the console for error messages
2. Verify environment variables are correctly set
3. Ensure wallet is properly connected
4. Check network tab for API call failures

## 🔮 Future Enhancements

- [ ] Data source comparison view
- [ ] Historical data analysis
- [ ] Custom data source configuration
- [ ] Advanced charting tools
- [ ] Mobile app version
- [ ] Real-time notifications
- [ ] Portfolio tracking
- [ ] Risk management tools

---

**Liquidex Frontend** - Advanced cryptocurrency trading dashboard with real-time analytics and secure wallet-based access control.
