import { Crypto, ChartData, NFT } from '../types';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_WS_URL = 'wss://stream.coingecko.com/';

// CoinGecko REST API functions
export const fetchTopCryptos = async (): Promise<Crypto[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.map((coin: any, index: number) => {
      // build chartData from sparkline_in_7d if available
      const sparkPrices: number[] = coin.sparkline_in_7d?.price || [];
      let chartData: ChartData[] = [];

      if (sparkPrices.length >= 7) {
        const last7 = sparkPrices.slice(-7);
        const now = new Date();
        chartData = last7.map((p: number, idx: number) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - idx));
          return {
            time: date.toISOString().split('T')[0],
            price: p,
          };
        });
      } else if (sparkPrices.length > 0) {
        // fallback: map whatever is available
        const now = new Date();
        chartData = sparkPrices.map((p: number, idx: number) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (sparkPrices.length - idx - 1));
          return {
            time: date.toISOString().split('T')[0],
            price: p,
          };
        });
      }

      return {
        id: coin.id,
        rank: index + 1,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        logoUrl: coin.image,
        price: coin.current_price,
        change1h: coin.price_change_percentage_1h_in_currency || 0,
        change24h: coin.price_change_percentage_24h_in_currency || 0,
        change7d: coin.price_change_percentage_7d_in_currency || 0,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        volumeCrypto: coin.total_volume / coin.current_price,
        circulatingSupply: coin.circulating_supply,
        maxSupply: coin.max_supply,
        chartData,
        isFavorite: false,
      };
    });
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

// Fetch chart data for a specific cryptocurrency
export const fetchChartData = async (coinId: string, days: number = 7): Promise<ChartData[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.prices.map(([timestamp, price]: [number, number]) => ({
      time: new Date(timestamp).toISOString().split('T')[0],
      price: price,
    }));
  } catch (error) {
    console.error(`Error fetching chart data for ${coinId}:`, error);
    // Return empty array as fallback
    return [];
  }
};

// CoinGecko NFT API functions
export const fetchTopNFTs = async (): Promise<NFT[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/nfts/list?order=market_cap_usd_desc&per_page=50&page=1&include_nft_details=true`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.map((nft: any, index: number) => ({
      id: nft.id,
      name: nft.name,
      symbol: nft.symbol,
      thumb: nft.thumb,
      floorPrice: nft.floor_price?.usd || null,
      marketCap: nft.market_cap?.usd || null,
      volume24h: nft.volume_24h?.usd || null,
      change24h: nft.price_change_percentage_24h?.usd || null,
      change7d: nft.price_change_percentage_7d?.usd || null,
      change30d: nft.price_change_percentage_30d?.usd || null,
      totalSupply: nft.total_supply,
      numberOfUniqueAddresses: nft.number_of_unique_addresses,
      numberOfOwners: nft.number_of_owners,
      chartData: [], // Will be populated separately if needed
      isFavorite: false,
    }));
  } catch (error) {
    console.error('Error fetching NFT data:', error);
    throw error;
  }
};

// Fetch chart data for a specific NFT
export const fetchNFTChartData = async (nftId: string, days: number = 7): Promise<ChartData[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/nfts/${nftId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.prices.map(([timestamp, price]: [number, number]) => ({
      time: new Date(timestamp).toISOString().split('T')[0],
      price: price,
    }));
  } catch (error) {
    console.error(`Error fetching NFT chart data for ${nftId}:`, error);
    // Return empty array as fallback
    return [];
  }
};

// WebSocket class for real-time updates
export class CoinGeckoWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private onPriceUpdate: (data: any) => void;

  constructor(onPriceUpdate: (data: any) => void) {
    this.onPriceUpdate = onPriceUpdate;
  }

  connect() {
    try {
      this.ws = new WebSocket(COINGECKO_WS_URL);

      this.ws.onopen = () => {
        console.log('Connected to CoinGecko WebSocket');
        this.reconnectAttempts = 0;

        // Subscribe to price updates for top cryptocurrencies
        const subscription = {
          type: 'subscribe',
          subscriptions: [
            {
              name: 'price',
              symbols: ['BTC', 'ETH', 'USDT', 'XRP', 'BNB', 'SOL', 'ADA', 'DOGE', 'DOT', 'MATIC']
            }
          ]
        };

        if (this.ws) {
          this.ws.send(JSON.stringify(subscription));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'price') {
            this.onPriceUpdate(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('CoinGecko WebSocket connection closed');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('CoinGecko WebSocket error:', error);
      };

    } catch (error) {
      console.error('Error connecting to CoinGecko WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Initialize WebSocket connection
export const initializeCoinGeckoWebSocket = (onPriceUpdate: (data: any) => void) => {
  const wsClient = new CoinGeckoWebSocket(onPriceUpdate);
  wsClient.connect();

  return () => wsClient.disconnect();
};
