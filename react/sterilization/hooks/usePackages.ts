import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SterilizationService } from "../services/SterilizationService";
import { PackageDto } from "../interfaces/models";
import { useMemo } from "react";
import { usePRToast } from "../../hooks/usePRToast";
import { SwalManager } from "../../../services/alertManagerImported.js";

export const usePackages = () => {
    const queryClient = useQueryClient();
    const service = useMemo(() => new SterilizationService(), []);
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

    const packagesQuery = useQuery<PackageDto[]>({
        queryKey: ['packages'],
        queryFn: async () => {
            const res = await service.getPackages();
            return res.data;
        }
    });

    const createPackage = useMutation({
        mutationFn: (data: Omit<PackageDto, 'id'>) => service.createPackage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            showSuccessToast({ title: 'Paquete creado', message: 'El paquete se ha creado correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const updatePackage = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Omit<PackageDto, 'id'> }) => service.updatePackage(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            showSuccessToast({ title: 'Paquete actualizado', message: 'El paquete se ha actualizado correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const deletePackageMutation = useMutation({
        mutationFn: (id: number) => service.deletePackage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            showSuccessToast({ title: 'Paquete eliminado', message: 'El paquete se ha eliminado correctamente' });
        },
        onError: (err: any) => showServerErrorsToast(err)
    });

    const deletePackage = async (id: number) => {
        await SwalManager.confirmDelete(async () => {
            await deletePackageMutation.mutateAsync(id);
        });
    };

    return {
        packages: packagesQuery.data || [],
        isLoading: packagesQuery.isLoading || packagesQuery.isFetching,
        refetch: packagesQuery.refetch,
        createPackage,
        updatePackage,
        deletePackage,
        toast
    };
};
