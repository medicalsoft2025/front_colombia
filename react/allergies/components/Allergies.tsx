import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { AllergiesTable } from './AllergiesTable';
import { AllergyFormModal } from './AllergyFormModal';
import { useAllergies } from '../hooks/useAllergies';
import { AllergyDto, CreateAllergyDto } from '../interfaces/models';
import { Dialog } from 'primereact/dialog';
import { AllergyHistoryModal } from './AllergyHistoryModal';
import { CustomPRTable } from '../../components/CustomPRTable';

interface AllergiesProps {
    patientId: number;
}

export const Allergies = (props: AllergiesProps) => {
    const { patientId } = props;
    const {
        allergies,
        isLoading,
        refetch,
        createAllergy,
        updateAllergy,
        updateAllergyStatus,
        deleteAllergy
    } = useAllergies(patientId);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedAllergy, setSelectedAllergy] = useState<AllergyDto | null>(null);

    const handleCreate = () => {
        setSelectedAllergy(null);
        setIsFormVisible(true);
    };

    const handleEdit = (allergy: AllergyDto) => {
        setSelectedAllergy(allergy);
        setIsFormVisible(true);
    };

    const handleSave = async (data: Omit<CreateAllergyDto, 'patientId'>) => {
        if (selectedAllergy) {
            await updateAllergy.mutateAsync({ id: selectedAllergy.id, data });
        } else {
            await createAllergy.mutateAsync(data);
        }
        setIsFormVisible(false);
    };

    const handleDelete = async (allergy: AllergyDto) => {
        await deleteAllergy(allergy.id);
    };

    const handleStatusChange = async (id: number, status: string) => {
        await updateAllergyStatus.mutateAsync({ id, status });
    };

    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    const handleHistory = (allergy: AllergyDto) => {
        setSelectedAllergy(allergy);
        setIsHistoryVisible(true);
    };

    return (
        <div className="card m-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Alergias del Paciente</h5>
                <Button
                    label="Nueva Alergia"
                    icon={<i className="fa fa-plus me-2" />}
                    onClick={handleCreate}
                />
            </div>
            <div className="card-body">
                <AllergiesTable
                    data={allergies}
                    loading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onHistory={handleHistory}
                    onStatusChange={handleStatusChange}
                    onReload={refetch}
                />
            </div>

            <AllergyFormModal
                visible={isFormVisible}
                onHide={() => setIsFormVisible(false)}
                onSave={handleSave}
                initialData={selectedAllergy}
                saving={createAllergy.isPending || updateAllergy.isPending}
            />

            <AllergyHistoryModal
                visible={isHistoryVisible}
                onHide={() => setIsHistoryVisible(false)}
                allergyId={selectedAllergy?.id || null}
                patientId={patientId}
            />
        </div>
    );
};