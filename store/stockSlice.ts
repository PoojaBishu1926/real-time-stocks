import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// import { RootState } from './store';

interface StockData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockState {
  data: StockData[];
  currentSymbol: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: StockState = {
  data: [],
  currentSymbol: '',
  isLoading: false,
  error: null,
};

export const stocksList = ['AAPL', 'GOOGL', 'AMZN']; // Example stocks list

export const fetchStockData = createAsyncThunk<StockData[], string, { rejectValue: string }>(
  'stock/fetchStockData',
  async (symbol, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/stocks/${symbol}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch stock data');
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setCurrentSymbol(state, action: PayloadAction<string>) {
      state.currentSymbol = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action: PayloadAction<StockData[]>) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentSymbol } = stockSlice.actions;

export default stockSlice.reducer;
