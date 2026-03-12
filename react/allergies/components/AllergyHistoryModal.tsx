import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAllergies } from '../hooks/useAllergies';
import { allergyStatusMap } from '../consts';

interface AllergyHistoryModalProps {
    visible: boolean;
    onHide: () => void;
    allergyId: number | null;
    patientId: number;
}

export const AllergyHistoryModal = (props: AllergyHistoryModalProps) => {
    const { visible, onHide, allergyId, patientId } = props;
    const { getAllergyHistory } = useAllergies(patientId);

    const { data: history, isLoading } = getAllergyHistory(allergyId);

    const statusTemplate = (status: string) => {
        return allergyStatusMap[status] || status;
    };

    return (
        <Dialog
            header="Historial de Alergia"
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
