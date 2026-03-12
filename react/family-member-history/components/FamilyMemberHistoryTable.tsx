import React, { useRef, useState } from 'react';
import { CustomPRTable } from '../../components/CustomPRTable';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';
import { FamilyMemberHistoryDto } from '../interfaces/models';
import { relationshipCodeMap, familyMemberHistoryStatuses } from '../consts';

interface FamilyMemberHistoryTableProps {
    data: FamilyMemberHistoryDto[];
    loading: boolean;
    onEdit: (rowData: FamilyMemberHistoryDto) => void;
    onDelete: (rowData: FamilyMemberHistoryDto) => void;
    onHistory: (rowData: FamilyMemberHistoryDto) => void;
    onStatusChange: (id: number, status: string) => void;
    onReload: () => void;
}

export const FamilyMemberHistoryTable = (props: FamilyMemberHistoryTableProps) => {
    const { data, loading, onEdit, onDelete, onHistory, onStatusChange, onReload } = props;

    const menuRef = useRef<Menu>(null);
    const [selectedRow, setSelectedRow] = useState<FamilyMemberHistoryDto | null>(null);

    const showMenu = (event: React.MouseEvent, rowData: FamilyMemberHistoryDto) => {
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
            field: 'relationshipCode',
            header: 'Familiar',
            body: (rowData: FamilyMemberHistoryDto) => {
                return relationshipCodeMap[rowData.relationshipCode] || rowData.relationshipCode;
            }
        },
        {
            field: 'cie11',
            header: 'CIE11',
            body: (rowData: FamilyMemberHistoryDto) => (
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '300px' }}>
                    {rowData.cie11}
                </div>
            )
        },
        {
            field: 'status',
            header: 'Estado',
            body: (rowData: FamilyMemberHistoryDto) => {
                return (
                    <Dropdown
                        value={rowData.status}
                        options={familyMemberHistoryStatuses}
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
            body: (rowData: FamilyMemberHistoryDto) => {
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
