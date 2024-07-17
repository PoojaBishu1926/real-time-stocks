import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentSymbol } from '../store/stockSlice';

interface ChangeSymbolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeSymbolModal: React.FC<ChangeSymbolModalProps> = ({ isOpen, onClose }) => {
  const [symbol, setSymbol] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setCurrentSymbol(symbol));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter crypto symbol (e.g., bitcoin)"
        />
        <button type="submit">Change Symbol</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ChangeSymbolModal;