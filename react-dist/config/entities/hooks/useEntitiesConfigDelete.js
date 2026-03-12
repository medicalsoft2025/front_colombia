import { useState } from "react";
import { entitiesService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useEntitiesConfigDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteEntity = async id => {
    setLoading(true);
    setError(null);
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        await entitiesService.deleteEntity(id);
        confirmed = true;
      });
      return confirmed;
    } catch (err) {
      ErrorHandler.generic(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    deleteEntity
  };
};