# Crypto Tracker

Crypto Tracker is a responsive web application built with React and Redux Toolkit that simulates real-time cryptocurrency market data. Inspired by platforms like CoinMarketCap, this project demonstrates dynamic UI updates and centralized state management using the CoinGecko API.

---

## Features

- Real-time price updates using CoinGecko API
- Dynamic table for top cryptocurrencies (BTC, ETH, USDT, etc.)
- Color-coded percentage changes (green for gains, red for losses)
- 7-day price trend charts (static SVG/images)
- Centralized state management with Redux Toolkit
- Optimized rendering using memoized selectors
- Fully responsive UI

---

## Implementation Overview

- Fetches live cryptocurrency data from the CoinGecko API
- Updates price, 1h %, 24h %, 7d %, and volume data
- All data flows through Redux actions
- No local component state used

---

## Tech Stack

- React
- Redux Toolkit
- React Redux
- TypeScript
- Vite
- Tailwind CSS / CSS Modules
- CoinGecko API

---

## Getting Started

```bash
npm install
npm run dev


