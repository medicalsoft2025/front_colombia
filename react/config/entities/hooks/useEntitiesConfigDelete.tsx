import { useState } from "react";
import { entitiesService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";

export const useEntitiesConfigDelete = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteEntity = async (id: string) => {
        setLoading(true);
        setError(null);

        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await entitiesService.deleteEntity(id);
                    confirmed = true
                }
            )
            return confirmed
        } catch (err) {
            ErrorHandler.generic(err)
            return false
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        deleteEntity,
    };
};