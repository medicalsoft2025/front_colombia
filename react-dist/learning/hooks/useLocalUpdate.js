import { LocalStorageService } from "../services/LocalStorageService.js";
export const useLocalUpdate = localStorageKey => {
  const update = async (id, data) => {
    const localStorageService = new LocalStorageService(localStorageKey);
    await localStorageService.update(id, data);
  };
  return {
    update
  };
};