
import { PayloadAction, createSelector, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Crypto } from '../../types';
import { fetchTopCryptos } from '../../utils/coingeckoApi';

interface CryptoState {
  cryptos: Crypto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  isDarkMode: boolean;
}

const initialState: CryptoState = {
  cryptos: [],
  status: 'idle',
  error: null,
  searchQuery: '',
  isDarkMode: true,
};

// Async thunk for fetching initial crypto data
export const fetchCryptos = createAsyncThunk(
  'crypto/fetchCryptos',
  async () => {
    const response = await fetchTopCryptos();
    return response;
  }
);

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateCryptoPrice: (
      state,
      action: PayloadAction<{ id: string; price: number; change1h: number; change24h: number; change7d: number; volume24h: number }>
    ) => {
      const index = state.cryptos.findIndex(crypto => crypto.id === action.payload.id);
      if (index !== -1) {
        state.cryptos[index].price = action.payload.price;
        state.cryptos[index].change1h = action.payload.change1h;
        state.cryptos[index].change24h = action.payload.change24h;
        state.cryptos[index].change7d = action.payload.change7d;
        state.cryptos[index].volume24h = action.payload.volume24h;
        state.cryptos[index].volumeCrypto = action.payload.volume24h / action.payload.price;
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.cryptos.findIndex(crypto => crypto.id === action.payload);
      if (index !== -1) {
        state.cryptos[index].isFavorite = !state.cryptos[index].isFavorite;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload.toLowerCase();
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cryptos = action.payload;
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch crypto data';
      });
  },
});

export const { updateCryptoPrice, toggleFavorite, setSearchQuery, toggleDarkMode } = cryptoSlice.actions;

// Selectors
export const selectAllCryptos = (state: RootState) => state.crypto.cryptos;
export const selectSearchQuery = (state: RootState) => state.crypto.searchQuery;
export const selectIsDarkMode = (state: RootState) => state.crypto.isDarkMode;

export const selectFilteredCryptos = createSelector(
  [selectAllCryptos, selectSearchQuery],
  (cryptos, searchQuery) => {
    if (!searchQuery) return cryptos;
    return cryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(searchQuery) ||
      crypto.symbol.toLowerCase().includes(searchQuery)
    );
  }
);

export const selectCryptoById = createSelector(
  [selectAllCryptos, (_, id: string) => id],
  (cryptos, id) => cryptos.find(crypto => crypto.id === id)
);

export default cryptoSlice.reducer;