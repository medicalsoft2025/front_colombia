import React from 'react';
import { CustomPRTable, CustomPRTableColumnProps } from '../../../components/CustomPRTable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { LoadDto } from '../../interfaces/models';

interface LoadTableProps {
    loads: LoadDto[];
    loading: boolean;
    onStatusChange: (loadId: number, status: LoadDto['status']) => void;
    onViewPackages: (load: LoadDto) => void;
    onViewDetail: (load: LoadDto) => void;
    onViewHistory: (load: LoadDto) => void;

    // Pagination props
    totalRecords: number;
    first: number;
    perPage: number;
    handlePageChange: (event: any) => void;
    handleSearchChange: (search: string) => void;
    refetch: () => void;
}

export const LoadTable = (props: LoadTableProps) => {
    const {
        loads, loading, onStatusChange, onViewPackages, onViewDetail, onViewHistory,
        totalRecords, first, perPage, handlePageChange, handleSearchChange, refetch
    } = props;

    const statusOptions = [
        { label: 'En Proceso', value: 'in_progress' },
        { label: 'Esterilizada', value: 'sterilized' },
        { label: 'Desechada', value: 'discarded' }
    ];

    const columns: CustomPRTableColumnProps[] = [
        {
            field: "sterilizationDate",
            header: "Fecha Esterilización",
            width: "12rem"
        },
        {
            field: "packages",
            header: "Paquetes",
            width: "12rem",
            body: (rowData: LoadDto) => (
                <Button
                    label={`${rowData.packages.length} Paquetes`}
                    size='small'
                    icon={<i className="fa fa-box me-2" />}
                    severity='secondary'
                    onClick={() => onViewPackages(rowData)}
                />
            )
        },
        {
            field: "status",
            header: "Estado",
            width: "15rem",
            body: (rowData: LoadDto) => (
                <Dropdown
                    value={rowData.status}
                    options={statusOptions}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(e: DropdownChangeEvent) => onStatusChange(rowData.id, e.value)}
                    placeholder="Seleccione un estado"
                    className="w-100"
                />
            )
        },
        {
            field: "actions",
            header: "Acciones",
            width: "10rem",
            body: (rowData: LoadDto) => (
                <div className="d-flex gap-2 justify-content-center">
                    <Button
                        icon={<i className="fa fa-eye" />}
                        tooltip="Ver detalle"
                        className="p-button-rounded p-button-text p-button-info"
                        onClick={() => onViewDetail(rowData)}
                    />
                    <Button
                        icon={<i className="fa fa-file-alt" />}
                        tooltip="Ver historial"
                        className="p-button-rounded p-button-text p-button-secondary"
                        onClick={() => onViewHistory(rowData)}
                    />
                </div>
            )
        }
    ];

    // Assigning uuid like expected by CustomPRTable for missing id tracking if needed,
    // though CustomPRTable usually expects data objects.
    const tableData = loads.map(load => ({
        ...load,
        uuid: load.id.toString()
    }));

    return (
        <CustomPRTable
            columns={columns}
            data={tableData}
            lazy
            first={first}
            rows={perPage}
            totalRecords={totalRecords}
            loading={loading}
            onPage={handlePageChange}
            onSearch={handleSearchChange}
            onReload={refetch}
        />
    );
};
