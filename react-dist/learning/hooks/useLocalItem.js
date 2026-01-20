import { useCallback, useState } from "react";
import { LocalStorageService } from "../services/LocalStorageService.js";
export const useLocalItem = localStorageKey => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const getItem = useCallback(async id => {
    setLoading(true);
    const localStorageService = new LocalStorageService(localStorageKey);
    const item = await localStorageService.getItem(id);
    setItem(item);
    setLoading(false);
    return item;
  }, [localStorageKey]);
  return {
    item,
    getItem,
    setItem,
    loading
  };
};