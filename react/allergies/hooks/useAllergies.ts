import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AllergiesService } from "../services/AllergiesService";
import { AllergyDto, CreateAllergyDto, UpdateAllergyDto, AllergyHistoryDto } from "../interfaces/models";
import { useMemo } from "react";
import { usePRToast } from "../../hooks/usePRToast";
import { SwalManager } from "../../../services/alertManagerImported.js";

export const useAllergies = (patientId: number) => {
    const queryClient = useQueryClient();
    const service = useMemo(() => new AllergiesService(), []);
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

    const allergiesQuery = useQuery<AllergyDto[]>({
        queryKey: ['allergies', patientId],
        queryFn: async () => {
            return await service.getAllergiesByPatient(patientId);
        },
        enabled: !!patientId
    });

    const createAllergy = useMutation({
        mutationFn: (data: Omit<CreateAllergyDto, 'patientId'>) => service.createAllergy(patientId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allergies', patientId] });
            showSuccessToast({ title: 'Alergia creada', message: 'La alergia se ha registrado correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const updateAllergy = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Omit<UpdateAllergyDto, 'patientId'> }) => service.updateAllergy(id, patientId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allergies', patientId] });
            queryClient.invalidateQueries({ queryKey: ['allergy-history'] });
            showSuccessToast({ title: 'Alergia actualizada', message: 'La alergia se ha actualizado correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const updateAllergyStatus = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => service.updateAllergyStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allergies', patientId] });
            queryClient.invalidateQueries({ queryKey: ['allergy-history'] });
            showSuccessToast({ title: 'Estado actualizado', message: 'El estado de la alergia se actualizó correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const deleteAllergyMutation = useMutation({
        mutationFn: (id: number) => service.deleteAllergy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allergies', patientId] });
            showSuccessToast({ title: 'Alergia eliminada', message: 'La alergia se ha eliminado correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const deleteAllergy = async (id: number) => {
        await SwalManager.confirmDelete(async () => {
            await deleteAllergyMutation.mutateAsync(id);
        });
    };

    const getAllergyHistory = (allergyId: number | null) => {
        return useQuery<AllergyHistoryDto[]>({
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
