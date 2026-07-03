import { createContext, useContext, useState } from 'react';

const PKR_TO_USD = 280; // Approximate exchange rate — update as needed

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem('primeride-currency') || 'PKR'
  );

  const toggleCurrency = () => {
    const next = currency === 'PKR' ? 'USD' : 'PKR';
    setCurrency(next);
    localStorage.setItem('primeride-currency', next);
  };

  const format = (amountPKR) => {
    if (currency === 'USD') {
      const usd = amountPKR / PKR_TO_USD;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(usd);
    }
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(amountPKR);
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, format, PKR_TO_USD }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
