import React, { createContext, useState } from "react";

type DriverContextType = {
  driver: any;
  setDriver: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: any;
  setError: React.Dispatch<React.SetStateAction<any>>;
  updateDriver: (driverData: any) => void;
};

const defaultValue: DriverContextType = {
  driver: null,
  setDriver: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
  updateDriver: () => {},
};

export const DriverDataContext = createContext<DriverContextType>(defaultValue);

const DriverContext = ({ children }: { children: React.ReactNode }) => {
  const [driver, setDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateDriver = (driverData: any) => {
    setDriver(driverData);
  };

  const value: DriverContextType = {
    driver,
    setDriver,
    isLoading,
    setIsLoading,
    error,
    setError,
    updateDriver,
  };

  return (
    <DriverDataContext.Provider value={value}>
      {children}
    </DriverDataContext.Provider>
  );
};

export default DriverContext;
