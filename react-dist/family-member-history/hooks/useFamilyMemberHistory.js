import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FamilyMemberHistoryService } from "../services/FamilyMemberHistoryService.js";
import { useMemo } from "react";
import { usePRToast } from "../../hooks/usePRToast.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useFamilyMemberHistory = patientId => {
  const queryClient = useQueryClient();
  const service = useMemo(() => new FamilyMemberHistoryService(), []);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const historyQuery = useQuery({
    queryKey: ['family-member-history', patientId],
    queryFn: async () => {
      return await service.getHistoryByPatient(patientId);
    },
    enabled: !!patientId
  });
  const createRecord = useMutation({
    mutationFn: data => service.createRecord(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['family-member-history', patientId]
      });
      showSuccessToast({
        title: 'Antecedente creado',
        message: 'El antecedente familiar se ha registrado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const updateRecord = useMutation({
    mutationFn: ({
      id,
      data
    }) => service.updateRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['family-member-history', patientId]
      });
      queryClient.invalidateQueries({
        queryKey: ['family-member-history-changes']
      });
      showSuccessToast({
        title: 'Antecedente actualizado',
        message: 'El antecedente familiar se ha actualizado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status
    }) => service.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['family-member-history', patientId]
      });
      queryClient.invalidateQueries({
        queryKey: ['family-member-history-changes']
      });
      showSuccessToast({
        title: 'Estado actualizado',
        message: 'El estado del antecedente se actualizó correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const deleteRecordMutation = useMutation({
    mutationFn: id => service.deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['family-member-history', patientId]
      });
      showSuccessToast({
        title: 'Antecedente eliminado',
        message: 'El antecedente familiar se ha eliminado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const deleteRecord = async id => {
    await SwalManager.confirmDelete(async () => {
      await deleteRecordMutation.mutateAsync(id);
    });
  };
  const getChangeHistory = recordId => {
    return useQuery({
      queryKey: ['family-member-history-changes', recordId],
      queryFn: async () => {
        if (!recordId) return [];
        return await service.getChangeHistory(recordId);
      },
      enabled: !!recordId
    });
  };
  return {
    records: historyQuery.data || [],
    isLoading: historyQuery.isLoading || historyQuery.isFetching,
    refetch: historyQuery.refetch,
    createRecord,
    updateRecord,
    updateStatus,
    deleteRecord,
    toast,
    getChangeHistory
  };
};