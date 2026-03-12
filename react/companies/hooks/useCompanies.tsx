import { useQuery } from '@tanstack/react-query';
import { companyService } from '../../../services/api';

export const useCompanies = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['companies'],
        queryFn: () => companyService.getAllCompanies(),
        placeholderData: [],
    })

    return {
        companies: data?.data ?? [],
        refetch,
        loading: isLoading || isFetching
    };
};
