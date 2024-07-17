import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const CryptoTable: React.FC = () => {
  const cryptoData = useSelector((state: RootState) => state.crypto.data);

  return (
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Symbol</th>
          <th>Price (USD)</th>
        </tr>
      </thead>
      <tbody>
        {cryptoData.map((data, index) => (
          <tr key={index}>
            <td>{new Date(data.timestamp).toLocaleString()}</td>
            <td>{data.symbol}</td>
            <td>${data.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CryptoTable;