import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchData',
  async (symbol: string) => {
    const response = await axios.get(`/api/crypto-data?symbol=${symbol}`);
    return response.data;
  }
);

interface CryptoState {
  data: any[];
  currentSymbol: string;
}

const initialState: CryptoState = {
  data: [],
  currentSymbol: 'bitcoin',
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setCurrentSymbol: (state, action) => {
      state.currentSymbol = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCryptoData.fulfilled, (state, action) => {
      state.data = action.payload;
      localStorage.setItem('cryptoData', JSON.stringify(action.payload));
    });
  },
});

export const { setCurrentSymbol } = cryptoSlice.actions;

export default cryptoSlice.reducer;