import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FamilyMemberHistoryService } from "../services/FamilyMemberHistoryService";
import {
    FamilyMemberHistoryDto,
    CreateFamilyMemberHistoryDto,
    UpdateFamilyMemberHistoryDto,
    FamilyMemberHistoryHistoryDto
} from "../interfaces/models";
import { useMemo } from "react";
import { usePRToast } from "../../hooks/usePRToast";
import { SwalManager } from "../../../services/alertManagerImported.js";

export const useFamilyMemberHistory = (patientId: number) => {
    const queryClient = useQueryClient();
    const service = useMemo(() => new FamilyMemberHistoryService(), []);
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

    const historyQuery = useQuery<FamilyMemberHistoryDto[]>({
        queryKey: ['family-member-history', patientId],
        queryFn: async () => {
            return await service.getHistoryByPatient(patientId);
        },
        enabled: !!patientId
    });

    const createRecord = useMutation({
        mutationFn: (data: Omit<CreateFamilyMemberHistoryDto, 'patientId'>) => service.createRecord(patientId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['family-member-history', patientId] });
            showSuccessToast({ title: 'Antecedente creado', message: 'El antecedente familiar se ha registrado correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const updateRecord = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateFamilyMemberHistoryDto }) => service.updateRecord(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['family-member-history', patientId] });
            queryClient.invalidateQueries({ queryKey: ['family-member-history-changes'] });
            showSuccessToast({ title: 'Antecedente actualizado', message: 'El antecedente familiar se ha actualizado correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const updateStatus = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => service.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['family-member-history', patientId] });
            queryClient.invalidateQueries({ queryKey: ['family-member-history-changes'] });
            showSuccessToast({ title: 'Estado actualizado', message: 'El estado del antecedente se actualizó correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const deleteRecordMutation = useMutation({
        mutationFn: (id: number) => service.deleteRecord(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['family-member-history', patientId] });
            showSuccessToast({ title: 'Antecedente eliminado', message: 'El antecedente familiar se ha eliminado correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const deleteRecord = async (id: number) => {
        await SwalManager.confirmDelete(async () => {
            await deleteRecordMutation.mutateAsync(id);
        });
    };

    const getChangeHistory = (recordId: number | null) => {
        return useQuery<FamilyMemberHistoryHistoryDto[]>({
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
