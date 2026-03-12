import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { useForm, Controller } from 'react-hook-form';
import { AllergyDto, CreateAllergyDto } from '../interfaces/models';
import { allergyStatuses, allergyTypes } from '../consts';

interface AllergyFormModalProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: Omit<CreateAllergyDto, 'patientId'>) => void;
    initialData: AllergyDto | null;
    saving?: boolean;
}

interface AllergyFormData {
    description: string;
    type: string;
    status: string;
}

export const AllergyFormModal = (props: AllergyFormModalProps) => {
    const { visible, onHide, onSave, initialData, saving } = props;

    const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<AllergyFormData>({
        defaultValues: {
            description: '',
            type: '',
            status: ''
        }
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                reset({
                    description: initialData.description,
                    type: initialData.type,
                    status: initialData.status
                });
            } else {
                reset({
                    description: '',
                    type: '',
                    status: ''
                });
            }
        }
    }, [visible, initialData, reset]);

    const onSubmit = (data: AllergyFormData) => {
        onSave(data);
    };

    const dialogFooter = (
        <div className="d-flex justify-content-end gap-2">
            <Button
                label="Cancelar"
                icon={<i className="fa fa-times me-2" />}
                severity='secondary'
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
            header={initialData ? "Editar Alergia" : "Nueva Alergia"}
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw' }}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            footer={dialogFooter}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                <div className="col-12">
                    <label htmlFor="type" className="form-label">Tipo de alergia <span className="text-danger">*</span></label>
                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: 'El tipo de alergia es requerido' }}
                        render={({ field }) => (
                            <Dropdown
                                id={field.name}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                options={allergyTypes}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Seleccione el tipo de alergia"
                                className={`w-100 ${errors.type ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.type && <small className="p-error">{errors.type.message}</small>}
                </div>

                <div className="col-12">
                    <label htmlFor="description" className="form-label">Descripción de la alergia <span className="text-danger">*</span></label>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'La descripción es requerida' }}
                        render={({ field }) => (
                            <InputTextarea
                                id={field.name}
                                {...field}
                                rows={3}
                                placeholder="Describa los síntomas del paciente frente a la alergia"
                                className={`w-100 ${errors.description ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.description && <small className="p-error">{errors.description.message}</small>}
                </div>

                <div className="col-12">
                    <label htmlFor="status" className="form-label">Estado de la alergia <span className="text-danger">*</span></label>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'El estado es requerido' }}
                        render={({ field }) => (
                            <Dropdown
                                id={field.name}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                options={allergyStatuses}
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
