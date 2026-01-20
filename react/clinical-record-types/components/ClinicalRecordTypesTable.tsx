import React from 'react';
import { CustomPRTable } from '../../components/CustomPRTable';
import { Button } from 'primereact/button';
import { ClinicalRecordTypeDto } from '../interfaces/models';

interface ClinicalRecordTypesTableProps {
    data: ClinicalRecordTypeDto[];
    loading: boolean;
    onEdit: (rowData: ClinicalRecordTypeDto) => void;
    onDelete: (rowData: ClinicalRecordTypeDto) => void;
    onReload: () => void;
}

export const ClinicalRecordTypesTable = (props: ClinicalRecordTypesTableProps) => {

    const { data, loading, onEdit, onDelete, onReload } = props;

    const columns = [
        {
            field: 'name',
            header: 'Nombre'
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: (rowData: ClinicalRecordTypeDto) => {
                return (
                    <div className="d-flex gap-2">
                        <Button
                            icon={<i className="fa fa-edit" />}
                            onClick={() => onEdit(rowData)}
                        />
                        <Button
                            icon={<i className="fa fa-trash" />}
                            severity='danger'
                            onClick={() => onDelete(rowData)}
                        />
                    </div>
                );
            }
        }
    ];

    return (
        <div>
            <CustomPRTable
                data={data}
                columns={columns}
                loading={loading}
                onReload={onReload}
            />
        </div>
    );
};