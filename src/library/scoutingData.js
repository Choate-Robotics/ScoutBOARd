import React, { createContext, useState } from 'react';

export const SDRContext = createContext();

export const SDRProvider = ({ children }) => {
  const [ScoutingDataRaw, setScoutingDataRaw] = useState([]);

  return (
    <SDRContext.Provider value={[ScoutingDataRaw, setScoutingDataRaw]}>
      {children}
    </SDRContext.Provider>
  );
};

export const PSContext = createContext();

export const PSProvider = ({ children }) => {
  const [PitScoutingData, setPitScoutingData] = useState([]);
  
  return (
    <PSContext.Provider value={[PitScoutingData, setPitScoutingData]}>
      {children}
    </PSContext.Provider>
  );
};

export const SDContext = createContext();

export const SDProvider = ({ children }) => {
  const [ScoutingData, setScoutingData] = useState([]);

  return (
    <SDContext.Provider value={[ScoutingData, setScoutingData]}>
      {children}
    </SDContext.Provider>
  );
};

export const IKContext = createContext();

export const IKProvider = ({ children }) => {
  const [ImportantKeys, setImportantKeys] = useState([]);

  return (
    <IKContext.Provider value={[ImportantKeys, setImportantKeys]}>
      {children}
    </IKContext.Provider>
  );
};