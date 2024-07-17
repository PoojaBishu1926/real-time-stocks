import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setCurrentSymbol, fetchStockData, stocksList } from '../store/stockSlice';

const StockTable: React.FC = () => {
  const dispatch = useDispatch();
  const { data, currentSymbol, isLoading, error } = useSelector((state: RootState) => state.stock);

  const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSymbol = event.target.value;
    dispatch(setCurrentSymbol(newSymbol));
    dispatch(fetchStockData(newSymbol));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <select value={currentSymbol} onChange={handleSymbolChange}>
        {stocksList.map((symbol) => (
          <option key={symbol} value={symbol}>{symbol}</option>
        ))}
      </select>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
                <td>${item.open}</td>
                <td>${item.high}</td>
                <td>${item.low}</td>
                <td>${item.close}</td>
                <td>{item.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default StockTable;