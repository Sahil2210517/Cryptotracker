import { PayloadAction, createSelector, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { NFT } from '../../types';
import { fetchTopNFTs } from '../../utils/coingeckoApi';

interface NFTState {
  nfts: NFT[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
}

const initialState: NFTState = {
  nfts: [],
  status: 'idle',
  error: null,
  searchQuery: '',
};

// Async thunk for fetching initial NFT data
export const fetchNFTs = createAsyncThunk(
  'nft/fetchNFTs',
  async () => {
    const response = await fetchTopNFTs();
    return response;
  }
);

export const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    toggleNFTFavorite: (state, action: PayloadAction<string>) => {
      const index = state.nfts.findIndex(nft => nft.id === action.payload);
      if (index !== -1) {
        state.nfts[index].isFavorite = !state.nfts[index].isFavorite;
      }
    },
    setNFTSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload.toLowerCase();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNFTs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNFTs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nfts = action.payload;
      })
      .addCase(fetchNFTs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch NFT data';
      });
  },
});

export const { toggleNFTFavorite, setNFTSearchQuery } = nftSlice.actions;

// Selectors
export const selectAllNFTs = (state: RootState) => state.nft.nfts;
export const selectNFTSearchQuery = (state: RootState) => state.nft.searchQuery;

export const selectFilteredNFTs = createSelector(
  [selectAllNFTs, selectNFTSearchQuery],
  (nfts, searchQuery) => {
    if (!searchQuery) return nfts;
    return nfts.filter(nft =>
      nft.name.toLowerCase().includes(searchQuery) ||
      nft.symbol.toLowerCase().includes(searchQuery)
    );
  }
);

export const selectNFTById = createSelector(
  [selectAllNFTs, (_, id: string) => id],
  (nfts, id) => nfts.find(nft => nft.id === id)
);

export default nftSlice.reducer;