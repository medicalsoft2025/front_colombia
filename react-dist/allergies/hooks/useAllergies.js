import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AllergiesService } from "../services/AllergiesService.js";
import { useMemo } from "react";
import { usePRToast } from "../../hooks/usePRToast.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useAllergies = patientId => {
  const queryClient = useQueryClient();
  const service = useMemo(() => new AllergiesService(), []);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const allergiesQuery = useQuery({
    queryKey: ['allergies', patientId],
    queryFn: async () => {
      return await service.getAllergiesByPatient(patientId);
    },
    enabled: !!patientId
  });
  const createAllergy = useMutation({
    mutationFn: data => service.createAllergy(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['allergies', patientId]
      });
      showSuccessToast({
        title: 'Alergia creada',
        message: 'La alergia se ha registrado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const updateAllergy = useMutation({
    mutationFn: ({
      id,
      data
    }) => service.updateAllergy(id, patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['allergies', patientId]
      });
      showSuccessToast({
        title: 'Alergia actualizada',
        message: 'La alergia se ha actualizado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const updateAllergyStatus = useMutation({
    mutationFn: ({
      id,
      status
    }) => service.updateAllergyStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['allergies', patientId]
      });
      queryClient.invalidateQueries({
        queryKey: ['allergy-history']
      });
      showSuccessToast({
        title: 'Estado actualizado',
        message: 'El estado de la alergia se actualizó correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const deleteAllergyMutation = useMutation({
    mutationFn: id => service.deleteAllergy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['allergies', patientId]
      });
      showSuccessToast({
        title: 'Alergia eliminada',
        message: 'La alergia se ha eliminado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const deleteAllergy = async id => {
    await SwalManager.confirmDelete(async () => {
      await deleteAllergyMutation.mutateAsync(id);
    });
  };
  const getAllergyHistory = allergyId => {
    return useQuery({
      queryKey: ['allergy-history', allergyId],
      queryFn: async () => {
        if (!allergyId) return [];
        return await service.getAllergyHistory(allergyId);
      },
      enabled: !!allergyId
    });
  };
  return {
    allergies: allergiesQuery.data || [],
    isLoading: allergiesQuery.isLoading || allergiesQuery.isFetching,
    refetch: allergiesQuery.refetch,
    createAllergy,
    updateAllergy,
    updateAllergyStatus,
    deleteAllergy,
    toast,
    getAllergyHistory
  };
};