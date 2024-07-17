import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockData } from '../store/stockSlice';
import { RootState, AppDispatch } from '../store';
import StockTable from './stockTable';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentSymbol = useSelector((state: RootState) => state.stock.currentSymbol);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchStockData(currentSymbol));
    }, 60000); // Fetch every minute to avoid hitting API rate limits

    return () => clearInterval(interval);
  }, [dispatch, currentSymbol]);

  return (
    <div>
      <h1>Stock Tracker</h1>
      <StockTable />
    </div>
  );
};

export default Home;
