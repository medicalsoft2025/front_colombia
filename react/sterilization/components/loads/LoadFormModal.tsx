import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { LoadDto, PackageDto } from '../../interfaces/models';
import { useLoads } from '../../hooks/useLoads';
import { usePackages } from '../../hooks/usePackages';
import { useUsersForSelect } from '../../../users/hooks/useUsersForSelect';
import { processTypes, reasons } from '../../consts';

interface LoadFormModalProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: Omit<LoadDto, 'id' | 'status'>) => void;
    saving?: boolean;
}

// Interfaz interna para el formulario
interface LoadFormData {
    processTypeId: string | null;
    reasonId: string | null;
    sterilizationDate: Date | null;
    startTime: Date | null;
    durationMinutes: number | null;
    temperature: number | null;
    pressure: number | null;
    validityDays: number | null;
    responsibleId: number | null;
    chemicalControl: boolean;
    biologicalControl: boolean;
    observations: string;
}

export const LoadFormModal = (props: LoadFormModalProps) => {
    const { visible, onHide, onSave, saving } = props;
    const { packages } = usePackages();
    const { users } = useUsersForSelect();

    const [selectedPackages, setSelectedPackages] = useState<PackageDto[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<PackageDto[]>([]);
    const [autoCompleteValue, setAutoCompleteValue] = useState<any>(null);

    const { control, handleSubmit, reset, watch, formState: { errors, isValid } } = useForm<LoadFormData>({
        defaultValues: {
            processTypeId: null,
            reasonId: null,
            sterilizationDate: null,
            startTime: null,
            durationMinutes: null,
            temperature: null,
            pressure: null,
            validityDays: null,
            responsibleId: null,
            chemicalControl: false,
            biologicalControl: false,
            observations: ''
        }
    });

    const watchStartTime = watch('startTime');
    const watchDuration = watch('durationMinutes');
    const watchSterilizationDate = watch('sterilizationDate');
    const watchValidityDays = watch('validityDays');

    // Cálculos dependientes
    const calculatedEndTime = React.useMemo(() => {
        if (watchStartTime && watchDuration) {
            const end = new Date(watchStartTime.getTime());
            end.setMinutes(end.getMinutes() + watchDuration);
            return end;
        }
        return null;
    }, [watchStartTime, watchDuration]);

    const calculatedExpirationDate = React.useMemo(() => {
        if (watchSterilizationDate && watchValidityDays) {
            const exp = new Date(watchSterilizationDate.getTime());
            exp.setDate(exp.getDate() + watchValidityDays);
            return exp;
        }
        return null;
    }, [watchSterilizationDate, watchValidityDays]);

    useEffect(() => {
        if (visible) {
            reset();
            setSelectedPackages([]);
            setAutoCompleteValue(null);
        }
    }, [visible, reset]);

    const onSubmit = (data: LoadFormData) => {
        if (selectedPackages.length === 0) {
            alert('Debe agregar al menos un paquete en la pestaña "Paquetes".');
            return;
        }
        // Construir el DTO
        const payload: Omit<LoadDto, 'id' | 'status'> = {
            processTypeId: data.processTypeId!,
            reasonId: data.reasonId!,
            sterilizationDate: data.sterilizationDate!.toISOString().split('T')[0],
            startTime: data.startTime!,
            durationMinutes: data.durationMinutes!,
            endTime: calculatedEndTime!,
            temperature: data.temperature!,
            pressure: data.pressure!,
            validityDays: data.validityDays!,
            expirationDate: calculatedExpirationDate!,
            responsibleId: data.responsibleId!,
            chemicalControl: data.chemicalControl,
            biologicalControl: data.biologicalControl,
            observations: data.observations,
            packages: selectedPackages
        };
        onSave(payload);
    };

    const searchPackage = (event: AutoCompleteCompleteEvent) => {
        let _filteredPackages;
        if (!event.query.trim().length) {
            _filteredPackages = [...packages];
        } else {
            _filteredPackages = packages.filter((pkg) => {
                return pkg.name.toLowerCase().includes(event.query.toLowerCase()) || pkg.prefix.toLowerCase().includes(event.query.toLowerCase());
            });
        }
        setFilteredPackages(_filteredPackages.filter(p => !selectedPackages.find(sp => sp.id === p.id)));
    };

    const onPackageSelect = (e: any) => {
        setSelectedPackages([...selectedPackages, e.value]);
        setAutoCompleteValue(null);
    };

    const removePackage = (pkgId: number) => {
        setSelectedPackages(selectedPackages.filter(p => p.id !== pkgId));
    };

    const dialogFooter = (
        <div className="d-flex justify-content-end gap-2 mt-3 p-3">
            <Button label="Cancelar" icon={<i className="fa fa-times me-2" />} severity='secondary' onClick={onHide} disabled={saving} type="button" />
            <Button label="Guardar Carga" icon={<i className={`fa fa-save me-2`} />} onClick={handleSubmit(onSubmit)} disabled={saving || !isValid || selectedPackages.length === 0} type="button" />
        </div>
    );

    return (
        <Dialog header="Nueva Carga" visible={visible} onHide={onHide} style={{ width: '70vw' }} breakpoints={{ '960px': '85vw', '641px': '100vw' }} footer={dialogFooter}>
            <TabView>
                <TabPanel header="Información">
                    <form className="row g-3">
                        <div className="col-12 col-md-6">
                            <label className="form-label">Tipo de proceso <span className="text-danger">*</span></label>
                            <Controller
                                name="processTypeId"
                                control={control}
                                rules={{ required: 'Obligatorio' }}
                                render={({ field }) => (
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        options={processTypes}
                                        optionLabel="name"
                                        optionValue="name"
                                        placeholder="Seleccione"
                                        className={`w-100 ${errors.processTypeId ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                            {errors.processTypeId && <small className="p-error">{errors.processTypeId.message}</small>}
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label">Motivo <span className="text-danger">*</span></label>
                            <Controller
                                name="reasonId"
                                control={control}
                                rules={{ required: 'Obligatorio' }}
                                render={({ field }) => (
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        options={reasons}
                                        optionLabel="name"
                                        optionValue="name"
                                        placeholder="Seleccione"
                                        className={`w-100 ${errors.reasonId ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                            {errors.reasonId && <small className="p-error">{errors.reasonId.message}</small>}
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label">Fecha esterilización <span className="text-danger">*</span></label>
                            <Controller
                                name="sterilizationDate"
                                control={control}
                                rules={{ required: 'Obligatorio' }}
                                render={({ field }) => (
                                    <Calendar
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        dateFormat="dd/mm/yy"
                                        showIcon
                                        className={`w-100 ${errors.sterilizationDate ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                            {errors.sterilizationDate && <small className="p-error">{errors.sterilizationDate.message}</small>}
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label">Hora inicio <span className="text-danger">*</span></label>
                            <Controller
                                name="startTime"
                                control={control}
                                rules={{ required: 'Obligatorio' }}
                                render={({ field }) => (
                                    <Calendar
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        timeOnly
                                        showIcon
                                        className={`w-100 ${errors.startTime ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                            {errors.startTime && <small className="p-error">{errors.startTime.message}</small>}
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label">Duración (min) <span className="text-danger">*</span></label>
                            <Controller
                                name="durationMinutes"
                                control={control}
                                rules={{ required: 'Obligatorio', min: 1 }}
                                render={({ field }) => (
                                    <InputNumber
                                        id={field.name}
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={`w-100 ${errors.durationMinutes ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                            {errors.durationMinutes && <small className="p-error">{errors.durationMinutes.message}</small>}
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label">Hora fin</label>
                            <Calendar
                                value={calculatedEndTime}
                                timeOnly
                                showIcon
                                disabled
                                className="w-100"
                            />
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label">Temperatura (°C) <span className="text-danger">*</span></label>
                            <Controller
                                name="temperature"
                                control={control}
                                rules={{ required: 'Obligatorio' }}
                                render={({ field }) => (
                                    <InputNumber
                                        id={field.name}
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={`w-100 ${errors.temperature ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                            {errors.temperature && <small className="p-error">{errors.temperature.message}</small>}
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label">Presión (PSI) <span className="text-danger">*</span></label>
                            <Controller
                                name="pressure"
                                control={control}
                                rules={{ required: 'Obligatorio' }}
                                render={({ field }) => (
                                    <InputNumber
                                        id={field.name}
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={`w-100 ${errors.pressure ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                            {errors.pressure && <small className="p-error">{errors.pressure.message}</small>}
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label">Vigencia (días) <span className="text-danger">*</span></label>
                            <Controller
                                name="validityDays"
                                control={control}
                                rules={{ required: 'Obligatorio', min: 1 }}
                                render={({ field }) => (
                                    <InputNumber
                                        id={field.name}
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={`w-100 ${errors.validityDays ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                            {errors.validityDays && <small className="p-error">{errors.validityDays.message}</small>}
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label">Fecha vencimiento</label>
                            <Calendar
                                value={calculatedExpirationDate}
                                dateFormat="dd/mm/yy"
                                showIcon
                                disabled
                                className="w-100"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label">Responsable <span className="text-danger">*</span></label>
                            <Controller
                                name="responsibleId"
                                control={control}
                                rules={{ required: 'Obligatorio' }}
                                render={({ field }) => (
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        options={users}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Seleccione"
                                        filter
                                        className={`w-100 ${errors.responsibleId ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                            {errors.responsibleId && <small className="p-error">{errors.responsibleId.message}</small>}
                        </div>

                        <div className="col-12 col-md-3 d-flex align-items-center mt-md-4 pt-md-3">
                            <Controller
                                name="chemicalControl"
                                control={control}
                                render={({ field }) => (
                                    <div className="field-checkbox mb-0">
                                        <Checkbox inputId={field.name} onChange={e => field.onChange(e.checked)} checked={field.value} />
                                        <label htmlFor={field.name} className="ml-2 mb-0 ms-2">Control químico</label>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="col-12 col-md-3 d-flex align-items-center mt-md-4 pt-md-3">
                            <Controller
                                name="biologicalControl"
                                control={control}
                                render={({ field }) => (
                                    <div className="field-checkbox mb-0">
                                        <Checkbox inputId={field.name} onChange={e => field.onChange(e.checked)} checked={field.value} />
                                        <label htmlFor={field.name} className="ml-2 mb-0 ms-2">Control biológico</label>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Observaciones</label>
                            <Controller
                                name="observations"
                                control={control}
                                render={({ field }) => (
                                    <InputTextarea
                                        id={field.name}
                                        {...field}
                                        rows={3}
                                        className="w-100"
                                    />
                                )}
                            />
                        </div>
                    </form>
                </TabPanel>

                <TabPanel header="Paquetes">
                    <div className="mt-2" style={{ minHeight: '300px' }}>
                        <label className="form-label">Buscar y seleccionar paquetes <span className="text-danger">*</span></label>
                        <AutoComplete
                            value={autoCompleteValue}
                            suggestions={filteredPackages}
                            completeMethod={searchPackage}
                            field="name"
                            onChange={(e) => setAutoCompleteValue(e.value)}
                            onSelect={onPackageSelect}
                            placeholder="Escriba el nombre del paquete"
                            className="w-100 mb-3"
                            inputClassName="w-100"
                        />

                        {selectedPackages.length === 0 && (
                            <div className="alert alert-warning text-center">
                                No hay paquetes seleccionados. Agregue al menos uno para guardar la carga.
                            </div>
                        )}

                        {selectedPackages.length > 0 && (
                            <ul className="list-group">
                                {selectedPackages.map(pkg => (
                                    <li key={pkg.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{pkg.prefix}</strong> - {pkg.name} <br />
                                            <small className="text-muted">{pkg.content}</small>
                                        </div>
                                        <Button
                                            icon={<i className="fa fa-trash" />}
                                            className="p-button-rounded p-button-danger p-button-text"
                                            onClick={() => removePackage(pkg.id)}
                                            type="button"
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
