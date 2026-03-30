import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { MedicationStatementDto } from "../interfaces/models";
import { MEDICATION_STATEMENT_STATUS_OPTIONS } from "../consts/status";

interface DuplicateMedicationModalProps {
    visible: boolean;
    onHide: () => void;
    activeMedications: MedicationStatementDto[];
    onUpdateStatusAndContinue: (medicationId: number, newStatus: string) => void;
    onContinueAsNew: () => void;
}

export const DuplicateMedicationModal: React.FC<DuplicateMedicationModalProps> = ({
    visible,
    onHide,
    activeMedications,
    onUpdateStatusAndContinue,
    onContinueAsNew
}) => {
    const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>({});

    const handleStatusChange = (id: number, status: string) => {
        setSelectedStatus(prev => ({ ...prev, [id]: status }));
    };

    return (
        <Dialog
            header="Medicamento ya activo"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={onHide}
            footer={
                <div className="d-flex justify-content-between w-100">
                    <Button label="Cancelar" severity="danger" onClick={onHide} />
                    <Button label="Continuar como medicamento nuevo" severity="secondary" onClick={onContinueAsNew} />
                </div>
            }
        >
            <div className="mb-4">
                <p>El paciente ya tiene los siguientes registros activos para este medicamento. ¿Desea actualizar el estado de alguno antes de continuar?</p>

                <div className="list-group">
                    {activeMedications.map(med => (
                        <div key={med.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="mb-0">{med.medicationName}</h6>
                                <small className="text-muted">{med.dosage || 'Sin dosis especificada'}</small>
                            </div>
                            <div className="d-flex gap-2 align-items-center" style={{ width: '300px' }}>
                                <Dropdown
                                    value={selectedStatus[med.id] || med.status}
                                    options={MEDICATION_STATEMENT_STATUS_OPTIONS}
                                    onChange={(e) => handleStatusChange(med.id, e.value)}
                                    placeholder="Estado"
                                    className="flex-grow-1"
                                />
                                <Button
                                    label="Actualizar estado y continuar"
                                    onClick={() => onUpdateStatusAndContinue(med.id, selectedStatus[med.id] || med.status)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Dialog>
    );
};
