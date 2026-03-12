import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import { MultiSelect } from 'primereact/multiselect';
import { resourcesAdminService, entitiesService, entitiesUserService } from '../../../services/api';

interface VinculateFormData {
    entityIds: any[];
    operationType: any;
    coverageType: any;
    paymentMethod: any;
    documentType: any;
    userType: number;
    contractNumber: any | null;
    polizaNumber: any | null;
}

export const VinculateEntitiesToUsers: React.FC<{ onSuccess: () => void, userId: string, toast: any }> = ({ onSuccess, userId, toast }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<VinculateFormData>({
        defaultValues: {
            entityIds: [],
            operationType: "",
            coverageType: "",
            paymentMethod: "",
            documentType: "",
            userType: 0,
            contractNumber: "",
            polizaNumber: "",
        }
    });

    const [entities, setEntities] = useState<any[]>([]);
    const [operationTypes, setOperationTypes] = useState<any[]>([]);
    const [coverageTypes, setCoverageTypes] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [documentTypes, setDocumentTypes] = useState<any[]>([]);
    const [userTypes, setUserTypes] = useState<any[]>([]);


    useEffect(() => {
        loadResources();
    }, []);

    const onSubmit = async (data: VinculateFormData) => {
        const payload = {
            entity_ids: data.entityIds,
            user_id: userId,
            operation_type_id: data.operationType.toString(),
            coverage_type_id: data.coverageType.toString(),
            payment_method_id: data.paymentMethod.toString(),
            document_type_id: data.documentType.toString(),
            user_type_id: data.userType.toString(),
            contract_number: data.contractNumber?.toString(),
            poliza_number: data.polizaNumber?.toString(),
        }

        const response = await entitiesUserService.create(payload);
        if (response.length > 0) {
            onSuccess();
        }

        toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Entidades vinculadas correctamente',
            life: 3000
        });
    };

    const getFormErrorMessage = (name: keyof VinculateFormData) => {
        return errors[name] ? <small className="p-error">{errors[name]?.message}</small> : <small className="p-error">&nbsp;</small>;
    };

    async function loadResources() {

        const operationTypesData = await resourcesAdminService.getHealthTypeOperations();
        const coverageTypesData = await resourcesAdminService.getHealthCoverages();
        const paymentTypesData = await resourcesAdminService.getHealthPaymentMethods();
        const documentTypesData = await resourcesAdminService.getHealthDocumentTypes();
        const userTypesData = await resourcesAdminService.getHealthUserTypes();
        const entitiesData = await entitiesService.getAll();

        setOperationTypes(operationTypesData);
        setCoverageTypes(coverageTypesData);
        setPaymentMethods(paymentTypesData);
        setDocumentTypes(documentTypesData);
        setUserTypes(userTypesData);
        setEntities(entitiesData.data);
    }

    return (
        <div className="container">
            <Card className="shadow-sm p-0">
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="entityIds" className="form-label fw-bold">Entidades</label>
                            <Controller
                                name="entityIds"
                                control={control}
                                rules={{ required: 'Entity type is required.' }}
                                render={({ field, fieldState }) => (
                                    <MultiSelect
                                        id={field.name}
                                        {...field}
                                        options={entities}
                                        placeholder="Seleccione la entidad"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        optionLabel="name"
                                        optionValue="id"
                                        appendTo={document.body}
                                    />
                                )}
                            />
                            {getFormErrorMessage('entityIds')}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="operationType" className="form-label fw-bold">Tipo de Operación</label>
                            <Controller
                                name="operationType"
                                control={control}
                                rules={{ required: 'Operation type is required.' }}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        id={field.name}
                                        {...field}
                                        optionLabel="name"
                                        optionValue="id"
                                        options={operationTypes}
                                        placeholder="Seleccione el tipo de operación"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                )}
                            />
                            {getFormErrorMessage('operationType')}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="coverageType" className="form-label fw-bold">Tipo de Cobertura</label>
                            <Controller
                                name="coverageType"
                                control={control}
                                rules={{ required: 'Coverage type is required.' }}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        id={field.name}
                                        {...field}
                                        optionLabel="name"
                                        optionValue="id"
                                        options={coverageTypes}
                                        placeholder="Seleccione el tipo de cobertura"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                )}
                            />
                            {getFormErrorMessage('coverageType')}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="paymentMethod" className="form-label fw-bold">Metodo de pago</label>
                            <Controller
                                name="paymentMethod"
                                control={control}
                                rules={{ required: 'Payment method is required.' }}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        id={field.name}
                                        {...field}
                                        optionLabel="name"
                                        optionValue="id"
                                        options={paymentMethods}
                                        placeholder="Seleccione el metodo de pago"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                )}
                            />
                            {getFormErrorMessage('paymentMethod')}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="documentType" className="form-label fw-bold">Tipo de documento</label>
                            <Controller
                                name="documentType"
                                control={control}
                                rules={{ required: 'Document type is required.' }}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        id={field.name}
                                        {...field}
                                        optionLabel="name"
                                        optionValue="id"
                                        options={documentTypes}
                                        placeholder="Seleccione el tipo de documento"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                )}
                            />
                            {getFormErrorMessage('documentType')}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="userType" className="form-label fw-bold">Tipo de usuario</label>
                            <Controller
                                name="userType"
                                control={control}
                                rules={{ required: 'Document type is required.' }}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        id={field.name}
                                        {...field}
                                        optionLabel="name"
                                        optionValue="id"
                                        options={userTypes}
                                        placeholder="Seleccione el tipo de usuario"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                )}
                            />
                            {getFormErrorMessage('userType')}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="contractNumber" className="form-label fw-bold">Numero de contrato</label>
                            <Controller
                                name="contractNumber"
                                control={control}
                                rules={{ required: 'Contract number is required.' }}
                                render={({ field, fieldState }) => (
                                    <InputNumber
                                        id={field.name}
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        useGrouping={false}
                                        min={0}
                                        placeholder="Ingrese el numero de contrato"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                )}
                            />
                            {getFormErrorMessage('contractNumber')}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="polizaNumber" className="form-label fw-bold">Numero de poliza</label>
                            <Controller
                                name="polizaNumber"
                                control={control}
                                rules={{ required: 'Poliza number is required.' }}
                                render={({ field, fieldState }) => (
                                    <InputNumber
                                        id={field.name}
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        useGrouping={false}
                                        placeholder="Ingrese el numero de poliza"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                )}
                            />
                            {getFormErrorMessage('polizaNumber')}
                        </div>

                        <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                            <Button type="button" label="Cancelar" icon="pi pi-times" className="p-button-secondary p-button-outlined" onClick={() => { reset(); onSuccess(); }} />
                            <Button type="submit" label="Guardar" icon="pi pi-check" className="p-button-primary" />
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};