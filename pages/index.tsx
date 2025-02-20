import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockData } from '../store/stockSlice';
import { RootState, AppDispatch } from '../store';
import StockTable from '../components/stockTable';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();  // Use AppDispatch type here
  const currentSymbol = useSelector((state: RootState) => state.stock.currentSymbol);

  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchStockData(currentSymbol));
    };

    fetchData(); // Fetch immediately on component mount

    const interval = setInterval(fetchData, 60000); // Then fetch every minute

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