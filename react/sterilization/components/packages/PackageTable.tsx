import React, { useRef, useState } from 'react';
import { CustomPRTable } from '../../../components/CustomPRTable';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { PackageDto } from '../../interfaces/models';

interface PackageTableProps {
    data: PackageDto[];
    loading: boolean;
    onEdit?: (rowData: PackageDto) => void;
    onDelete?: (rowData: PackageDto) => void;
    onReload?: () => void;
    readOnly?: boolean; // Useful when displayed inside Cargas
}

export const PackageTable = (props: PackageTableProps) => {
    const { data, loading, onEdit, onDelete, onReload, readOnly = false } = props;
    const menuRef = useRef<Menu>(null);
    const [selectedRow, setSelectedRow] = useState<PackageDto | null>(null);

    const showMenu = (event: React.MouseEvent, rowData: PackageDto) => {
        setSelectedRow(rowData);
        menuRef.current?.toggle(event);
    };

    const items = [
        {
            label: 'Editar',
            icon: <i className="fa fa-edit me-1" />,
            command: () => selectedRow && onEdit && onEdit(selectedRow)
        },
        { separator: true },
        {
            label: 'Eliminar',
            icon: <i className="fa fa-trash me-1" />,
            className: 'text-danger',
            command: () => selectedRow && onDelete && onDelete(selectedRow)
        }
    ];

    const columns: any[] = [
        { field: 'name', header: 'Nombre' },
        { field: 'prefix', header: 'Prefijo' },
        { field: 'content', header: 'Contenido' }
    ];

    if (!readOnly) {
        columns.push({
            field: 'actions',
            header: 'Acciones',
            body: (rowData: PackageDto) => {
                return (
                    <div className="d-flex justify-content-end align-items-center gap-2">
                        <Button
                            icon={<i className="fa fa-cog me-1" />}
                            label="Acciones"
                            onClick={(e) => showMenu(e, rowData)}
                        />
                    </div>
                );
            }
        });
    }

    return (
        <div>
            {!readOnly && <Menu model={items} popup ref={menuRef} />}
            <CustomPRTable
                data={data}
                columns={columns}
                loading={loading}
                onReload={onReload}
            />
        </div>
    );
};
