import React from 'react';
import { Dialog } from 'primereact/dialog';
import { LoadDto } from '../../interfaces/models';

interface LoadDetailModalProps {
    visible: boolean;
    onHide: () => void;
    load: LoadDto | null;
}

export const LoadDetailModal = (props: LoadDetailModalProps) => {
    const { visible, onHide, load } = props;

    if (!load) return null;

    return (
        <Dialog
            header="Detalle de la Carga"
            visible={visible}
            onHide={onHide}
            style={{ width: '60vw' }}
            breakpoints={{ '960px': '85vw', '641px': '100vw' }}
        >
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <strong className="d-block text-muted small">Tipo de proceso</strong>
                    <span>{load.processTypeId || '-'}</span>
                </div>
                <div className="col-12 col-md-6">
                    <strong className="d-block text-muted small">Motivo</strong>
                    <span>{load.reasonId || '-'}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Fecha de esterilización</strong>
                    <span>{load.sterilizationDate}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Hora inicio</strong>
                    <span>{load.startTime.toString()}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Duración (min)</strong>
                    <span>{load.durationMinutes}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Hora fin</strong>
                    <span>{load.endTime.toString()}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Temperatura (°C)</strong>
                    <span>{load.temperature}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Presión (PSI)</strong>
                    <span>{load.pressure}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Vigencia (días)</strong>
                    <span>{load.validityDays}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Fecha de vencimiento</strong>
                    <span>{load.expirationDate.toString()}</span>
                </div>
                <div className="col-12 col-md-6">
                    <strong className="d-block text-muted small">Responsable</strong>
                    <span>{load.responsibleName || '-'}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Control químico</strong>
                    <span>{load.chemicalControl ? 'Sí' : 'No'}</span>
                </div>
                <div className="col-12 col-md-3">
                    <strong className="d-block text-muted small">Control biológico</strong>
                    <span>{load.biologicalControl ? 'Sí' : 'No'}</span>
                </div>
                <div className="col-12">
                    <strong className="d-block text-muted small">Observaciones</strong>
                    <span>{load.observations || 'N/A'}</span>
                </div>
            </div>
        </Dialog>
    );
};
