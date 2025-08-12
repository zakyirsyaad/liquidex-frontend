# Liquidex Frontend - KOM & BBA Data Integration

## Overview

This project now supports two data sources:

- **KOM Data**: Original data from `KOM_Dashboard_Data.json`
- **BBA Data**: New data from `BBA_Dashboard_Data.json`

## API Endpoints

### KOM Data

- **Endpoint**: `/api/liquidex`
- **Source**: `https://github.com/Linando/Liquidex_dashboard_data/blob/main/KOM_Dashboard_Data.json`
- **Method**: GET

### BBA Data

- **Endpoint**: `/api/liquidex/bba`
- **Source**: `https://github.com/Linando/Liquidex_dashboard_data/blob/main/BBA_Dashboard_Data.json`
- **Method**: GET

## Features

### Data Source Selector

- Toggle between KOM and BBA data sources
- Real-time switching without page refresh
- Visual indicator showing active data source

### Real-time Updates

- Both data sources are fetched simultaneously
- 30-second polling interval for live updates
- Automatic data saving to Supabase

### Unified Dashboard

- Single dashboard interface for both data sources
- Exchange selection works with both KOM and BBA data
- All charts and indicators automatically update based on selected source

## Technical Implementation

### Store Updates

- `exchangeStore.ts` now supports multiple data sources
- `getCurrentData()` function returns data based on selected source
- Separate state for KOM and BBA data

### Hook Updates

- `useRealTimeData.ts` fetches both data sources
- `getLiquidex.tsx` renamed to support both sources
- `getBBA.tsx` for BBA-specific data fetching

### Component Updates

- All dashboard components use `getCurrentData()`
- Header component includes data source selector
- Dashboard shows active data source indicator

## Usage

### Switching Data Sources

1. Use the KOM Data / BBA Data buttons in the header
2. Dashboard automatically updates to show selected source
3. Exchange selection persists across data source changes

### Data Flow

1. Real-time hook fetches both KOM and BBA data
2. Data is stored separately in the store
3. UI components use `getCurrentData()` to get active source
4. Automatic saving to Supabase for both sources

## Environment Variables

Ensure you have the following environment variable set:

```
GITHUB_TOKEN=your_github_token_here
```

## Future Enhancements

- Data source comparison view
- Historical data switching
- Custom data source configuration
- Data source health monitoring
