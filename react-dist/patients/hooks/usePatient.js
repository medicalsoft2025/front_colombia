import { patientService } from "../../../services/api/index.js";
import { useQuery } from '@tanstack/react-query';
export const usePatient = patientId => {
  const {
    data,
    refetch
  } = useQuery({
    queryKey: ['patient', patientId.toString()],
    queryFn: () => patientService.get(patientId)
  });
  return {
    patient: data,
    fetchPatient: refetch
  };
};