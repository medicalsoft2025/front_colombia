import { createContext, useContext } from "react";
export const LocalStorageContext = /*#__PURE__*/createContext(undefined);
export const useLocalStorageContext = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error("useLocalStorageContext must be used within LocalStorageProvider");
  }
  return context;
};