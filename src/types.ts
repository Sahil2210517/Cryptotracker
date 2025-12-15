export interface ChartData {
  time: string;
  price: number;
}

export interface Crypto {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  logoUrl: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  volumeCrypto: number;
  circulatingSupply: number;
  maxSupply: number | null;
  chartData: ChartData[];
  isFavorite: boolean;
}

export interface NFT {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  floorPrice: number | null;
  marketCap: number | null;
  volume24h: number | null;
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
  totalSupply: number | null;
  numberOfUniqueAddresses: number | null;
  numberOfOwners: number | null;
  chartData: ChartData[];
  isFavorite: boolean;
}