import React, { useState } from 'react';
import { PackageTable } from './PackageTable';
import { PackageFormModal } from './PackageFormModal';
import { usePackages } from '../../hooks/usePackages';
import { Button } from 'primereact/button';
import { PackageDto } from '../../interfaces/models';
import { Toast } from 'primereact/toast';

export const PackagesTab = () => {
    const { packages, isLoading, refetch, createPackage, updatePackage, deletePackage, toast } = usePackages();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<PackageDto | null>(null);

    const handleNew = () => {
        setSelectedPackage(null);
        setModalVisible(true);
    };

    const handleEdit = (pkg: PackageDto) => {
        setSelectedPackage(pkg);
        setModalVisible(true);
    };

    const handleDelete = (pkg: PackageDto) => {
        deletePackage(pkg.id);
    };

    const handleSave = (data: Omit<PackageDto, 'id'>) => {
        if (selectedPackage) {
            updatePackage.mutate({ id: selectedPackage.id, data }, {
                onSuccess: () => setModalVisible(false)
            });
        } else {
            createPackage.mutate(data, {
                onSuccess: () => setModalVisible(false)
            });
        }
    };

    return (<>
        <Toast ref={toast} />
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="m-0">Gestión de Paquetes</h5>
            <Button
                label="Nuevo paquete"
                icon={<i className="fa fa-plus me-2" />}
                className="p-button-primary"
                onClick={handleNew}
            />
        </div>

        <PackageTable
            data={packages}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReload={refetch}
        />

        <PackageFormModal
            visible={modalVisible}
            onHide={() => setModalVisible(false)}
            onSave={handleSave}
            initialData={selectedPackage}
            saving={createPackage.isPending || updatePackage.isPending}
        />
    </>);
};
