import { useState } from 'react';
import { userAvailabilityService } from "../../../services/api/index.js";
import { convertDateToHHMM } from "../../../services/utilidades.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const useUserAvailabilityCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    toast,
    showSuccessToast,
    showServerErrorsToast
  } = usePRToast();
  const createUserAvailability = async userAvailabilityData => {
    setLoading(true);
    try {
      const data = {
        ...userAvailabilityData,
        start_time: convertDateToHHMM(userAvailabilityData.start_time),
        end_time: convertDateToHHMM(userAvailabilityData.end_time),
        free_slots: userAvailabilityData.free_slots.map(slot => ({
          ...slot,
          start_time: convertDateToHHMM(slot.start_time),
          end_time: convertDateToHHMM(slot.end_time)
        }))
      };
      await userAvailabilityService.createForParent(userAvailabilityData.user_id, data);
      showSuccessToast({
        message: "Se creó la disponibilidad exitosamente"
      });
    } catch (error) {
      showServerErrorsToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createUserAvailability,
    toast
  };
};