import { LocalStorageService } from "../services/LocalStorageService.js";
export const useLocalRemove = localStorageKey => {
  const remove = async id => {
    const localStorageService = new LocalStorageService(localStorageKey);
    await localStorageService.remove(id);
  };
  return {
    remove
  };
};