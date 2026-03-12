import React, { useState } from 'react';
import { LoadTable } from './LoadTable';
import { LoadFormModal } from './LoadFormModal';
import { LoadDetailModal } from './LoadDetailModal';
import { LoadHistoryModal } from './LoadHistoryModal';
import { LoadPackagesModal } from './LoadPackagesModal';
import { useLoads, LoadFilters } from '../../hooks/useLoads';
import { Button } from 'primereact/button';
import { LoadDto } from '../../interfaces/models';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

export const LoadsTab = () => {
    const [filters, setFilters] = useState<LoadFilters>({
        status: null,
        sterilizationDate: null
    });

    const {
        loads,
        isLoading,
        createLoad,
        updateLoadStatus,
        handlePageChange,
        handleSearchChange,
        totalRecords,
        first,
        perPage,
        refetch,
        toast
    } = useLoads(filters);

    const [formVisible, setFormVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [historyVisible, setHistoryVisible] = useState(false);
    const [packagesVisible, setPackagesVisible] = useState(false);

    const [selectedLoad, setSelectedLoad] = useState<LoadDto | null>(null);

    const handleNew = () => {
        setFormVisible(true);
    };

    const handleSaveLoad = (data: Omit<LoadDto, 'id' | 'status'>) => {
        createLoad.mutate(data, {
            onSuccess: () => setFormVisible(false)
        });
    };

    const handleStatusChange = (loadId: number, status: LoadDto['status']) => {
        updateLoadStatus.mutate({ id: loadId, status });
    };

    const handleViewDetail = (load: LoadDto) => {
        setSelectedLoad(load);
        setDetailVisible(true);
    };

    const handleViewHistory = (load: LoadDto) => {
        setSelectedLoad(load);
        setHistoryVisible(true);
    };

    const handleViewPackages = (load: LoadDto) => {
        setSelectedLoad(load);
        setPackagesVisible(true);
    };

    const statusOptions = [
        { label: 'En Proceso', value: 'in_progress' },
        { label: 'Esterilizada', value: 'sterilized' },
        { label: 'Desechada', value: 'discarded' }
    ];

    return (<>
        <Toast ref={toast} />
        <Accordion activeIndex={null} className="mb-4">
            <AccordionTab header="Filtros">
                <div className="row">
                    <div className="col-12 col-md-4 mb-2 mb-md-0">
                        <label className="form-label d-block">Estado</label>
                        <Dropdown
                            value={filters.status}
                            options={statusOptions}
                            optionLabel="label"
                            optionValue="value"
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.value }))}
                            placeholder="Todos"
                            className="w-100"
                            showClear
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label className="form-label d-block">Fecha de esterilización</label>
                        <Calendar
                            value={filters.sterilizationDate}
                            onChange={(e) => {
                                if (e.value) {
                                    const d = e.value as Date;
                                    setFilters(prev => ({ ...prev, sterilizationDate: d }));
                                } else {
                                    setFilters(prev => ({ ...prev, sterilizationDate: null }));
                                }
                            }}
                            dateFormat="yy-mm-dd"
                            placeholder="YYYY-MM-DD"
                            className="w-100"
                        />
                    </div>
                </div>
            </AccordionTab>
        </Accordion>

        <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="m-0">Gestión de Cargas</h5>
            <Button
                label="Nueva carga"
                icon={<i className="fa fa-plus me-2" />}
                className="p-button-primary"
                onClick={handleNew}
            />
        </div>

        <LoadTable
            loads={loads}
            loading={isLoading}
            onStatusChange={handleStatusChange}
            onViewDetail={handleViewDetail}
            onViewHistory={handleViewHistory}
            onViewPackages={handleViewPackages}
            totalRecords={totalRecords}
            first={first}
            perPage={perPage}
            handlePageChange={handlePageChange}
            handleSearchChange={handleSearchChange}
            refetch={refetch}
        />

        <LoadFormModal
            visible={formVisible}
            onHide={() => setFormVisible(false)}
            onSave={handleSaveLoad}
            saving={createLoad.isPending}
        />

        <LoadDetailModal
            visible={detailVisible}
            onHide={() => setDetailVisible(false)}
            load={selectedLoad}
        />

        <LoadHistoryModal
            visible={historyVisible}
            onHide={() => setHistoryVisible(false)}
            loadId={selectedLoad?.id || null}
        />

        <LoadPackagesModal
            visible={packagesVisible}
            onHide={() => setPackagesVisible(false)}
            packages={selectedLoad?.packages || []}
        />
    </>);
};
