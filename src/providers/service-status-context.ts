import { createContext, useContext } from 'react';

export const ServiceStatusContext = createContext(false);

export const useServiceStatus = () => useContext(ServiceStatusContext);
