import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './features/cryptoSlice';
import nftReducer from './features/nftSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    nft: nftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;