import React from 'react';
import { Dialog } from 'primereact/dialog';
import { PackageTable } from '../packages/PackageTable';
import { PackageDto } from '../../interfaces/models';

interface LoadPackagesModalProps {
    visible: boolean;
    onHide: () => void;
    packages: PackageDto[];
}

export const LoadPackagesModal = (props: LoadPackagesModalProps) => {
    const { visible, onHide, packages } = props;

    return (
        <Dialog
            header="Paquetes vinculados a la carga"
            visible={visible}
            onHide={onHide}
            style={{ width: '60vw' }}
            breakpoints={{ '960px': '85vw', '641px': '100vw' }}
        >
            <PackageTable data={packages} loading={false} readOnly={true} />
        </Dialog>
    );
};
