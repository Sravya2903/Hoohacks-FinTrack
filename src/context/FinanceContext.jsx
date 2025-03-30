import React, { createContext, useState } from 'react';

export const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [budget, setBudget] = useState(0);

  return (
    <FinanceContext.Provider value={{ budget, setBudget }}>
      {children}
    </FinanceContext.Provider>
  );
}