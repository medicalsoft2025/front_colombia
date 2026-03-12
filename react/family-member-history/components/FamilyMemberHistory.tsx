import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { FamilyMemberHistoryTable } from './FamilyMemberHistoryTable';
import { FamilyMemberHistoryFormModal } from './FamilyMemberHistoryFormModal';
import { useFamilyMemberHistory } from '../hooks/useFamilyMemberHistory';
import { FamilyMemberHistoryDto, CreateFamilyMemberHistoryDto } from '../interfaces/models';
import { FamilyMemberHistoryHistoryModal } from './FamilyMemberHistoryHistoryModal';

interface FamilyMemberHistoryProps {
    patientId: number;
}

export const FamilyMemberHistory = (props: FamilyMemberHistoryProps) => {
    const { patientId } = props;
    const {
        records,
        isLoading,
        refetch,
        createRecord,
        updateRecord,
        updateStatus,
        deleteRecord
    } = useFamilyMemberHistory(patientId);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<FamilyMemberHistoryDto | null>(null);

    const handleCreate = () => {
        setSelectedRecord(null);
        setIsFormVisible(true);
    };

    const handleEdit = (record: FamilyMemberHistoryDto) => {
        setSelectedRecord(record);
        setIsFormVisible(true);
    };

    const handleSave = async (data: Omit<CreateFamilyMemberHistoryDto, 'patientId'>) => {
        if (selectedRecord) {
            await updateRecord.mutateAsync({ id: selectedRecord.id, data });
        } else {
            await createRecord.mutateAsync(data);
        }
        setIsFormVisible(false);
    };

    const handleDelete = async (record: FamilyMemberHistoryDto) => {
        await deleteRecord(record.id);
    };

    const handleStatusChange = async (id: number, status: string) => {
        await updateStatus.mutateAsync({ id, status });
    };

    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    const handleHistory = (record: FamilyMemberHistoryDto) => {
        setSelectedRecord(record);
        setIsHistoryVisible(true);
    };

    return (
        <div className="card m-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Antecedentes Familiares</h5>
                <Button
                    label="Nuevo Antecedente"
                    icon={<i className="fa fa-plus me-2" />}
                    onClick={handleCreate}
                />
            </div>
            <div className="card-body">
                <FamilyMemberHistoryTable
                    data={records}
                    loading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onHistory={handleHistory}
                    onStatusChange={handleStatusChange}
                    onReload={refetch}
                />
            </div>

            <FamilyMemberHistoryFormModal
                visible={isFormVisible}
                onHide={() => setIsFormVisible(false)}
                onSave={handleSave}
                initialData={selectedRecord}
                saving={createRecord.isPending || updateRecord.isPending}
            />

            <FamilyMemberHistoryHistoryModal
                visible={isHistoryVisible}
                onHide={() => setIsHistoryVisible(false)}
                recordId={selectedRecord?.id || null}
                patientId={patientId}
            />
        </div>
    );
};
