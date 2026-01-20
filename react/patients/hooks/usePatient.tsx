import { useState, useEffect } from 'react';
import { patientService } from '../../../services/api/index';
import { useQuery } from '@tanstack/react-query';

export const usePatient = (patientId: string) => {
    const { data, refetch } = useQuery({
        queryKey: ['patient', patientId.toString()],
        queryFn: () => patientService.get(patientId),
    });

    return { patient: data, fetchPatient: refetch };
};
