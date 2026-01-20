import { useEffect, useState } from "react";
import { LocalStorageService } from "../services/LocalStorageService.js";
export const useLocalItems = localStorageKey => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const getItems = async () => {
    setLoading(true);
    const localStorageService = new LocalStorageService(localStorageKey);
    const items = await localStorageService.getItems();
    setItems(items);
    setLoading(false);
  };
  useEffect(() => {
    getItems();
  }, []);
  return {
    items,
    loading,
    getItems
  };
};