import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useLoads } from '../../hooks/useLoads';

interface LoadHistoryModalProps {
    visible: boolean;
    onHide: () => void;
    loadId: number | null;
}

export const LoadHistoryModal = (props: LoadHistoryModalProps) => {
    const { visible, onHide, loadId } = props;
    const { getLoadHistory } = useLoads();

    const { data: history, isLoading } = getLoadHistory(loadId);

    return (
        <Dialog
            header="Historial de Estados"
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw' }}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        >
            <DataTable value={history || []} loading={isLoading} showGridlines size="small" emptyMessage="No hay historial registrado.">
                <Column field="changedAt" header="Fecha de Cambio" body={(rowData) => new Date(rowData.changedAt).toLocaleString()} />
                <Column field="previousStatus" header="Estado Anterior" />
                <Column field="newStatus" header="Nuevo Estado" />
                <Column field="changedBy" header="Usuario" />
            </DataTable>
        </Dialog>
    );
};
