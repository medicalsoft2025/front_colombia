import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicationStatementsService } from "../services/MedicationStatementsService.js";
import { usePRToast } from "../../hooks/usePRToast.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useMedicationStatements = patientId => {
  const queryClient = useQueryClient();
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const medicationsQuery = useQuery({
    queryKey: ['medication-statements', patientId],
    queryFn: async () => {
      return await medicationStatementsService.getMedicationsByPatient(patientId);
    },
    enabled: !!patientId
  });
  const createMedication = useMutation({
    mutationFn: data => medicationStatementsService.createMedication(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medication-statements', patientId]
      });
      showSuccessToast({
        title: 'Medicamento registrado',
        message: 'El medicamento se ha registrado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const updateMedication = useMutation({
    mutationFn: ({
      id,
      data
    }) => medicationStatementsService.updateMedication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medication-statements', patientId]
      });
      queryClient.invalidateQueries({
        queryKey: ['medication-history']
      });
      showSuccessToast({
        title: 'Medicamento actualizado',
        message: 'El medicamento se ha actualizado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const updateMedicationStatus = useMutation({
    mutationFn: ({
      id,
      status
    }) => medicationStatementsService.updateMedicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medication-statements', patientId]
      });
      queryClient.invalidateQueries({
        queryKey: ['medication-history']
      });
      showSuccessToast({
        title: 'Estado actualizado',
        message: 'El estado del medicamento se actualizó correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const deleteMedicationMutation = useMutation({
    mutationFn: id => medicationStatementsService.deleteMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medication-statements', patientId]
      });
      showSuccessToast({
        title: 'Medicamento eliminado',
        message: 'El registro se ha eliminado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const deleteMedication = async id => {
    await SwalManager.confirmDelete(async () => {
      await deleteMedicationMutation.mutateAsync(id);
    });
  };
  return {
    medications: medicationsQuery.data || [],
    isLoading: medicationsQuery.isLoading || medicationsQuery.isFetching,
    refetch: medicationsQuery.refetch,
    createMedication,
    updateMedication,
    updateMedicationStatus,
    deleteMedication,
    toast
  };
};
export const useMedicationHistory = medicationStatementId => {
  return useQuery({
    queryKey: ['medication-history', medicationStatementId],
    queryFn: async () => {
      if (!medicationStatementId) return [];
      return await medicationStatementsService.getMedicationHistory(medicationStatementId);
    },
    enabled: !!medicationStatementId
  });
};