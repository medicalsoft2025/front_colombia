import { useState, useEffect } from 'react';
import { clinicalRecordTypeService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { ClinicalRecordTypeDto } from '../interfaces/models';

export const useClinicalRecordTypes = () => {
    const [clinicalRecordTypes, setClinicalRecordTypes] = useState<ClinicalRecordTypeDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClinicalRecordTypes = async () => {
        try {
            setLoading(true);
            const data: ClinicalRecordTypeDto[] = await clinicalRecordTypeService.getAll();
            setClinicalRecordTypes(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinicalRecordTypes();
    }, []);

    return {
        clinicalRecordTypes,
        fetchClinicalRecordTypes,
        loading
    };
};
