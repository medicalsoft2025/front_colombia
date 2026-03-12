import React, { useRef, useState } from 'react';
import { CustomPRTable } from '../../components/CustomPRTable';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';
import { AllergyDto } from '../interfaces/models';
import { allergyTypeMap, allergyStatuses } from '../consts';

interface AllergiesTableProps {
    data: AllergyDto[];
    loading: boolean;
    onEdit: (rowData: AllergyDto) => void;
    onDelete: (rowData: AllergyDto) => void;
    onHistory: (rowData: AllergyDto) => void;
    onStatusChange: (id: number, status: string) => void;
    onReload: () => void;
}

export const AllergiesTable = (props: AllergiesTableProps) => {
    const { data, loading, onEdit, onDelete, onHistory, onStatusChange, onReload } = props;

    const menuRef = useRef<Menu>(null);
    const [selectedRow, setSelectedRow] = useState<AllergyDto | null>(null);

    const showMenu = (event: React.MouseEvent, rowData: AllergyDto) => {
        setSelectedRow(rowData);
        menuRef.current?.toggle(event);
    };

    const items = [
        {
            label: 'Editar',
            icon: <i className="fa fa-edit me-1" />,
            command: () => selectedRow && onEdit(selectedRow)
        },
        {
            label: 'Ver Historial',
            icon: <i className="fa fa-history me-1" />,
            command: () => selectedRow && onHistory(selectedRow)
        },
        {
            separator: true
        },
        {
            label: 'Eliminar',
            icon: <i className="fa fa-trash me-1" />,
            className: 'text-danger',
            command: () => selectedRow && onDelete(selectedRow)
        }
    ];

    const columns = [
        {
            field: 'description',
            header: 'Descripción',
            body: (rowData: AllergyDto) => (
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '300px' }}>
                    {rowData.description}
                </div>
            )
        },
        {
            field: 'type',
            header: 'Tipo',
            body: (rowData: AllergyDto) => {
                return allergyTypeMap[rowData.type] || rowData.type;
            }
        },
        {
            field: 'status',
            header: 'Estado',
            body: (rowData: AllergyDto) => {
                return (
                    <Dropdown
                        value={rowData.status}
                        options={allergyStatuses}
                        onChange={(e) => onStatusChange(rowData.id, e.value)}
                        optionLabel="label"
                        optionValue="value"
                        className="w-100"
                    />
                );
            }
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: (rowData: AllergyDto) => {
                return (
                    <div className="d-flex justify-content-end align-items-center gap-2">
                        <Button
                            icon={<i className="fa fa-cog me-1" />}
                            label='Acciones'
                            severity="secondary"
                            onClick={(e) => showMenu(e, rowData)}
                        />
                    </div>
                );
            }
        }
    ];

    return (
        <div>
            <Menu model={items} popup ref={menuRef} />
            <CustomPRTable
                data={data}
                columns={columns}
                loading={loading}
                onReload={onReload}
            />
        </div>
    );
};
