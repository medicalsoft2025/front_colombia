import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';
import { MedicationStatementDto, CreateMedicationStatementDto } from '../interfaces/models';
import { MEDICATION_STATEMENT_STATUS_OPTIONS } from '../consts/status';
import { medicationService } from '../../prescriptions/services/MedicationService';

interface MedicationStatementFormModalProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: Omit<CreateMedicationStatementDto, 'patientId'>) => void;
    initialData: MedicationStatementDto | null;
    saving?: boolean;
}

interface MedicationStatementFormData {
    medicationId: number | null;
    medicationName: string;
    dosage: string;
    status: string;
}

export const MedicationStatementFormModal = (props: MedicationStatementFormModalProps) => {
    const { visible, onHide, onSave, initialData, saving } = props;
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loadingMedicines, setLoadingMedicines] = useState(false);

    const { control, handleSubmit, reset, setValue, formState: { errors, isValid } } = useForm<MedicationStatementFormData>({
        defaultValues: {
            medicationId: null,
            medicationName: '',
            dosage: '',
            status: 'active'
        }
    });

    useEffect(() => {
        if (visible) {
            loadMedicines();
            if (initialData) {
                reset({
                    medicationId: initialData.medicationId,
                    medicationName: initialData.medicationName,
                    dosage: initialData.dosage || '',
                    status: initialData.status
                });
            } else {
                reset({
                    medicationId: null,
                    medicationName: '',
                    dosage: '',
                    status: 'active'
                });
            }
        }
    }, [visible, initialData, reset]);

    const loadMedicines = async () => {
        try {
            setLoadingMedicines(true);
            const response = await medicationService.getAll();
            setMedicines(response.data || []);
        } catch (error) {
            console.error('Error loading medicines catalog', error);
        } finally {
            setLoadingMedicines(false);
        }
    };

    const onSubmit = (data: MedicationStatementFormData) => {
        onSave({ ...data, notes: null });
    };

    const handleMedicationChange = (val: any) => {
        if (val) {
            setValue('medicationId', Number(val.id || val.Codigo));
            setValue('medicationName', val.descripcion);
        } else {
            setValue('medicationId', null);
            setValue('medicationName', '');
        }
    };

    const dialogFooter = (
        <div className="d-flex justify-content-end gap-2">
            <Button
                label="Cancelar"
                icon={<i className="fa fa-times me-2" />}
                severity="secondary"
                onClick={onHide}
                disabled={saving}
                type="button"
            />
            <Button
                label="Guardar"
                icon={<i className={`fa ${saving ? 'fa-spinner fa-spin' : 'fa-save'} me-2`} />}
                onClick={handleSubmit(onSubmit)}
                disabled={saving || !isValid}
                type="button"
            />
        </div>
    );

    return (
        <Dialog
            header={initialData ? "Editar Medicamento" : "Nuevo Medicamento"}
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw' }}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            footer={dialogFooter}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                <div className="col-12">
                    <label htmlFor="medicationId" className="form-label">Medicamento <span className="text-danger">*</span></label>
                    <Controller
                        name="medicationId"
                        control={control}
                        rules={{ required: 'La selección de medicamento es requerida' }}
                        render={({ field }) => (
                            <Dropdown
                                id={field.name}
                                value={medicines.find(m => Number(m.id || m.Codigo) === field.value)}
                                onChange={(e) => handleMedicationChange(e.value)}
                                options={medicines}
                                optionLabel="descripcion"
                                filter
                                loading={loadingMedicines}
                                placeholder="Busque y seleccione un medicamento"
                                className={`w-100 ${errors.medicationId ? 'p-invalid' : ''}`}
                                virtualScrollerOptions={{
                                    itemSize: 38,
                                }}
                            />
                        )}
                    />
                    {errors.medicationId && <small className="p-error">{errors.medicationId.message}</small>}
                </div>

                <div className="col-12">
                    <label htmlFor="dosage" className="form-label">Dosis / Frecuencia</label>
                    <Controller
                        name="dosage"
                        control={control}
                        render={({ field }) => (
                            <InputText
                                id={field.name}
                                {...field}
                                value={field.value || ''}
                                placeholder="Ej: 1 cada 8 horas"
                                className={`w-100 ${errors.dosage ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                </div>

                <div className="col-12">
                    <label htmlFor="status" className="form-label">Estado <span className="text-danger">*</span></label>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'El estado es requerido' }}
                        render={({ field }) => (
                            <Dropdown
                                id={field.name}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                options={MEDICATION_STATEMENT_STATUS_OPTIONS}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Seleccione un estado"
                                className={`w-100 ${errors.status ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.status && <small className="p-error">{errors.status.message}</small>}
                </div>
            </form>
        </Dialog>
    );
};
