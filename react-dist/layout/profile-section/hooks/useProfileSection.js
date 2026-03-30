import { userService } from "../../../../services/api/index.js";
import { useQuery } from "@tanstack/react-query";
export const useProfileSection = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["profile-section"],
    queryFn: () => userService.getLoggedUser()
  });
  const imageUrlMinio = data?.minio_url ? getUrlImage(data.minio_url) : undefined;
  const dayOffice = data?.availabilities?.length ? data.availabilities.find(availability => {
    return availability.days_of_week.includes(new Date().getDay());
  })?.office : null;
  return {
    user: data ? {
      ...data,
      imageUrlMinio,
      dayOffice
    } : undefined,
    refetch,
    loading: isLoading || isFetching
  };
};