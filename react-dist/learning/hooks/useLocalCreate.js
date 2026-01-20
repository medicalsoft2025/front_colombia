import { LocalStorageService } from "../services/LocalStorageService.js";
export const useLocalCreate = localStorageKey => {
  const create = async data => {
    const localStorageService = new LocalStorageService(localStorageKey);
    await localStorageService.create(data);
  };
  return {
    create
  };
};