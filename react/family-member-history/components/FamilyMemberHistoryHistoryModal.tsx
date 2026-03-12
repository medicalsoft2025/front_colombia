import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useFamilyMemberHistory } from '../hooks/useFamilyMemberHistory';
import { familyMemberHistoryStatusMap } from '../consts';

interface FamilyMemberHistoryHistoryModalProps {
    visible: boolean;
    onHide: () => void;
    recordId: number | null;
    patientId: number;
}

export const FamilyMemberHistoryHistoryModal = (props: FamilyMemberHistoryHistoryModalProps) => {
    const { visible, onHide, recordId, patientId } = props;
    const { getChangeHistory } = useFamilyMemberHistory(patientId);

    const { data: history, isLoading } = getChangeHistory(recordId);

    const statusTemplate = (status: string) => {
        return familyMemberHistoryStatusMap[status] || status;
    };

    return (
        <Dialog
            header="Historial de Antecedente Familiar"
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw' }}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        >
            <DataTable value={history || []} loading={isLoading} showGridlines size="small" emptyMessage="No hay historial registrado.">
                <Column
                    field="changedAt"
                    header="Fecha de Cambio"
                    body={(rowData) => rowData.changedAt ? new Date(rowData.changedAt).toLocaleString() : ''}
                    sortable
                />
                <Column
                    field="previousStatus"
                    header="Estado Anterior"
                    body={(rowData) => statusTemplate(rowData.previousStatus)}
                />
                <Column
                    field="newStatus"
                    header="Nuevo Estado"
                    body={(rowData) => statusTemplate(rowData.newStatus)}
                />
                <Column field="changedBy" header="Usuario" />
            </DataTable>
        </Dialog>
    );
};
