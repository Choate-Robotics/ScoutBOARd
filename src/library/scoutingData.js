import React, { createContext, useState } from 'react';

export const SDContext = createContext();

export const SDProvider = ({ children }) => {
  const [ScoutingData, setScoutingData] = useState([]);

  return (
    <SDContext.Provider value={[ScoutingData, setScoutingData]}>
      {children}
    </SDContext.Provider>
  );
};