import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';
import { PackageDto } from '../../interfaces/models';

interface PackageFormModalProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: Omit<PackageDto, 'id'>) => void;
    initialData: PackageDto | null;
    saving?: boolean;
}

interface PackageFormData {
    name: string;
    prefix: string;
    content: string;
}

export const PackageFormModal = (props: PackageFormModalProps) => {
    const { visible, onHide, onSave, initialData, saving } = props;

    const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<PackageFormData>({
        defaultValues: {
            name: '',
            prefix: '',
            content: ''
        }
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                reset({
                    name: initialData.name,
                    prefix: initialData.prefix,
                    content: initialData.content
                });
            } else {
                reset({
                    name: '',
                    prefix: '',
                    content: ''
                });
            }
        }
    }, [visible, initialData, reset]);

    const onSubmit = (data: PackageFormData) => {
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
            header={initialData ? "Editar Paquete" : "Nuevo Paquete"}
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw' }}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            footer={dialogFooter}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                <div className="col-12 col-md-9">
                    <label htmlFor="name" className="form-label">Nombre <span className="text-danger">*</span></label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'El nombre es requerido' }}
                        render={({ field }) => (
                            <InputText
                                id={field.name}
                                {...field}
                                className={`w-100 ${errors.name ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.name && <small className="p-error">{errors.name.message}</small>}
                </div>

                <div className="col-12 col-md-3">
                    <label htmlFor="prefix" className="form-label">Prefijo <span className="text-danger">*</span></label>
                    <Controller
                        name="prefix"
                        control={control}
                        rules={{ required: 'El prefijo es requerido' }}
                        render={({ field }) => (
                            <InputText
                                id={field.name}
                                {...field}
                                className={`w-100 ${errors.prefix ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.prefix && <small className="p-error">{errors.prefix.message}</small>}
                </div>

                <div className="col-12">
                    <label htmlFor="content" className="form-label">Contenido <span className="text-danger">*</span></label>
                    <Controller
                        name="content"
                        control={control}
                        rules={{ required: 'El contenido es requerido' }}
                        render={({ field }) => (
                            <InputText
                                id={field.name}
                                {...field}
                                className={`w-100 ${errors.content ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.content && <small className="p-error">{errors.content.message}</small>}
                </div>
            </form>
        </Dialog>
    );
};
