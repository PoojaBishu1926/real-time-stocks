import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from '../store/cryptoSlics';
import { RootState, AppDispatch } from '../store';
import CryptoTable from '../components/cryptoTable';
import ChangeSymbolModal from '../components/changeSymbolModal';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentSymbol = useSelector((state: RootState) => state.crypto.currentSymbol);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchCryptoData(currentSymbol));
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, currentSymbol]);

  return (
    <div>
      <h1>Crypto Tracker</h1>
      <button onClick={() => setIsModalOpen(true)}>Change Symbol</button>
      <CryptoTable />
      <ChangeSymbolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;