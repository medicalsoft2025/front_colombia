import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SterilizationService } from "../services/SterilizationService.js";
import { useMemo } from "react";
import { usePRToast } from "../../hooks/usePRToast.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const usePackages = () => {
  const queryClient = useQueryClient();
  const service = useMemo(() => new SterilizationService(), []);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const packagesQuery = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const res = await service.getPackages();
      return res.data;
    }
  });
  const createPackage = useMutation({
    mutationFn: data => service.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['packages']
      });
      showSuccessToast({
        title: 'Paquete creado',
        message: 'El paquete se ha creado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const updatePackage = useMutation({
    mutationFn: ({
      id,
      data
    }) => service.updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['packages']
      });
      showSuccessToast({
        title: 'Paquete actualizado',
        message: 'El paquete se ha actualizado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const deletePackageMutation = useMutation({
    mutationFn: id => service.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['packages']
      });
      showSuccessToast({
        title: 'Paquete eliminado',
        message: 'El paquete se ha eliminado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const deletePackage = async id => {
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