import React, { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler";
import { UserAvailabilityFormInputs } from '../components/UserAvailabilityForm';
import { userAvailabilityService } from '../../../services/api';
import { convertDateToHHMM } from '../../../services/utilidades';
import { usePRToast } from '../../hooks/usePRToast';

export const useUserAvailabilityUpdate = () => {
    const [loading, setLoading] = useState(true);
    const { toast, showSuccessToast, showServerErrorsToast } = usePRToast();

    const updateUserAvailability = async (id: string, data: UserAvailabilityFormInputs) => {
        setLoading(true);
        try {
            const newData = {
                ...data,
                start_time: convertDateToHHMM(data.start_time),
                end_time: convertDateToHHMM(data.end_time),
                free_slots: data.free_slots.map(slot => ({
                    ...slot,
                    start_time: convertDateToHHMM(slot.start_time),
                    end_time: convertDateToHHMM(slot.end_time)
                }))
            }
            await userAvailabilityService.update(id, newData);
            showSuccessToast({ message: "Se editó la disponibilidad exitosamente" })
        } catch (error) {
            ErrorHandler.generic(error);
            throw error
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUserAvailability,
        loading,
        toast
    };
};
