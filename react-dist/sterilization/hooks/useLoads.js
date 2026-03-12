import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SterilizationService } from "../services/SterilizationService.js";
import { useMemo, useState } from "react";
import { usePaginatedQuery } from "../../hooks/usePaginatedQuery.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const useLoads = filters => {
  const queryClient = useQueryClient();
  const service = useMemo(() => new SterilizationService(), []);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const [totalRecords, setTotalRecords] = useState(0);
  const paginatedLoads = usePaginatedQuery({
    queryKey: ['loads', filters?.status, filters?.sterilizationDate],
    queryFn: async paginationParams => {
      const response = await service.getLoads({
        page: paginationParams.page,
        perPage: paginationParams.perPage,
        search: paginationParams.search,
        status: filters?.status || undefined,
        sterilizationDate: filters?.sterilizationDate?.toISOString().split('T')[0] || undefined
      });
      setTotalRecords(response.total);
      return response.data;
    }
  });
  const createLoad = useMutation({
    mutationFn: data => service.createLoad(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['loads']
      });
      showSuccessToast({
        title: 'Carga creada',
        message: 'La carga se ha registrado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const updateLoadStatus = useMutation({
    mutationFn: ({
      id,
      status
    }) => service.updateLoadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['loads']
      });
      queryClient.invalidateQueries({
        queryKey: ['loadHistory']
      });
      showSuccessToast({
        title: 'Estado actualizado',
        message: 'El estado de la carga se ha actualizado correctamente'
      });
    },
    onError: err => showServerErrorsToast(err)
  });
  const getLoadHistory = loadId => {
    return useQuery({
      queryKey: ['loadHistory', loadId],
      queryFn: () => loadId ? service.getLoadHistory(loadId) : Promise.resolve([]),
      enabled: !!loadId
    });
  };
  return {
    loads: paginatedLoads.data || [],
    isLoading: paginatedLoads.isLoading || paginatedLoads.isFetching,
    refetch: paginatedLoads.refetch,
    handlePageChange: paginatedLoads.handlePageChange,
    handleSearchChange: paginatedLoads.handleSearchChange,
    totalRecords,
    first: paginatedLoads.first,
    perPage: paginatedLoads.perPage,
    createLoad,
    updateLoadStatus,
    getLoadHistory,
    toast
  };
};