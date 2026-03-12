import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { EntitiesFormInputs, EntitiesFormProps } from "../interfaces/entitiesForm";
import { documentTypes as documentTypesConstant } from "../interfaces/constant";
import useLocationDropdowns from "../../../cities/hooks/useLocationDropdowns";
import { resourcesAdminService } from "../../../../services/api";
import { InputNumber } from "primereact/inputnumber";

const EntitiesConfigForm: React.FC<EntitiesFormProps> = ({
    formId,
    onSubmit,
    initialData,
    onCancel,
    loading = false,
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<EntitiesFormInputs>({
        defaultValues: initialData || {
            name: "",
            entity_code: "",
            document_type: "CC",
            document_number: "",
            email: "",
            address: "",
            phone: "",
            country_id: "",
            department_id: "",
            city_id: "",
            tax_charge_id: null,
            withholding_tax_id: null,
            koneksi_sponsor_slug: null,
            type_organization_id: "",
            type_liability_id: "",
            type_regime_id: "",
            operation_type_id: "",
            coverage_type_id: "",
            payment_method_id: "",
            document_type_id: "",
            user_type_id: "",
            contract_number: "",
            poliza_number: "",
            isEditing: false,
        },
    });

    const [operationTypes, setOperationTypes] = useState<any[]>([]);
    const [coverageTypes, setCoverageTypes] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

    const watchCountry = watch("country_id");
    const watchDepartment = watch("department_id");

    const {
        countryOptions,
        departmentOptions,
        cityOptions,
        selectedCountry,
        selectedDepartment,
        selectedCity,
        handleCountryChange,
        handleDepartmentChange,
        handleCityChange,
        loading: locationLoading,
    } = useLocationDropdowns();

    const [isInitialized, setIsInitialized] = useState(false);
    const [organizationTypes, setOrganizationTypes] = useState<any[]>([]);
    const [liabilityTypes, setLiabilityTypes] = useState<any[]>([]);
    const [regimeTypes, setRegimeTypes] = useState<any[]>([]);

    async function loadResources() {
        const organizationTypes = await resourcesAdminService.getOrganizationTypes();
        const liabilityTypes = await resourcesAdminService.getLiabilityTypes();
        const regimeTypes = await resourcesAdminService.getRegimeTypes();
        const operationTypesData = await resourcesAdminService.getHealthTypeOperations();
        const coverageTypesData = await resourcesAdminService.getHealthCoverages();
        const paymentTypesData = await resourcesAdminService.getHealthPaymentMethods();
        const documentTypesData = await resourcesAdminService.getHealthDocumentTypes();
        const userTypesData = await resourcesAdminService.getHealthUserTypes();

        setOrganizationTypes(organizationTypes);
        setLiabilityTypes(liabilityTypes);
        setRegimeTypes(regimeTypes);
        setOperationTypes(operationTypesData);
        setCoverageTypes(coverageTypesData);
        setPaymentMethods(paymentTypesData);
        setDocumentTypes(documentTypesData);
        setUserTypes(userTypesData);

    }

    const onFormSubmit: SubmitHandler<EntitiesFormInputs> = (data) => {
        onSubmit({
            ...data,
            country_id: data.country_id,
            department_id: data.department_id,
            city_id: data.city_id,
        });
    };

    const getFormErrorMessage = (name: keyof EntitiesFormInputs) => {
        return (
            errors[name] && <small className="p-error">{errors[name]?.message}</small>
        );
    };

    useEffect(() => {
        loadResources();
        if (initialData && !isInitialized) {
            reset(initialData);

            if (initialData.country_id) {
                const countryId = initialData.country_id.toString();
                setValue("country_id", countryId);
                handleCountryChange(countryId);

                if (initialData.department_id) {
                    const departmentId = initialData.department_id.toString();
                    setTimeout(() => {
                        setValue("department_id", departmentId);
                        handleDepartmentChange(departmentId);

                        if (initialData.city_id) {
                            const cityId = initialData.city_id.toString();
                            setTimeout(() => {
                                setValue("city_id", cityId);
                                handleCityChange(cityId);
                            }, 300);
                        }
                    }, 300);
                }
            }

            setIsInitialized(true);
        }
    }, [initialData, reset, setValue, isInitialized]);

    useEffect(() => {
        if (selectedCountry) {
            setValue("country_id", selectedCountry, { shouldValidate: true });
        }
    }, [selectedCountry, setValue]);

    useEffect(() => {
        if (selectedDepartment) {
            setValue("department_id", selectedDepartment, { shouldValidate: true });
        }
    }, [selectedDepartment, setValue]);

    useEffect(() => {
        if (selectedCity) {
            setValue("city_id", selectedCity, { shouldValidate: true });
        }
    }, [selectedCity, setValue]);

    return (
        <form id={formId} onSubmit={handleSubmit(onFormSubmit)}>
            <div className="row">
                {/* Columna izquierda */}
                <div className="col-md-6">
                    <div className="mb-3">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "El nombre es requerido" }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor={field.name} className="form-label">
                                        Nombre *
                                    </label>
                                    <InputText
                                        id={field.name}
                                        className={classNames("w-100", {
                                            "p-invalid": errors.name,
                                        })}
                                        {...field}
                                    />
                                </>
                            )}
                        />
                        {getFormErrorMessage("name")}
                    </div>

                    <div className="mb-3">
                        <Controller
                            name="entity_code"
                            control={control}
                            rules={{ required: "El código es requerido" }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor={field.name} className="form-label">
                                        Código *
                                    </label>
                                    <InputText
                                        id={field.name}
                                        className={classNames("w-100", {
                                            "p-invalid": errors.entity_code,
                                        })}
                                        {...field}
                                    />
                                </>
                            )}
                        />
                        {getFormErrorMessage("entity_code")}
                    </div>

                    <div className="mb-3">
                        <Controller
                            name="document_type"
                            control={control}
                            rules={{ required: "El tipo de documento es requerido" }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor={field.name} className="form-label">
                                        Tipo de Documento *
                                    </label>
                                    <Dropdown
                                        id={field.name}
                                        options={documentTypesConstant}
                                        optionLabel="label"
                                        optionValue="value"
                                        className={classNames("w-100", {
                                            "p-invalid": errors.document_type,
                                        })}
                                        {...field}
                                    />
                                </>
                            )}
                        />
                        {getFormErrorMessage("document_type")}
                    </div>

                    <div className={watch("document_type") === 'NIT' && initialData === undefined && !initialData?.isEditing ? 'row col-md-12 align-items-center' : 'mb-3'}>
                        <div className={watch("document_type") === 'NIT' && initialData === undefined && !initialData?.isEditing ? 'col-8' : 'mb-3'}>
                            <Controller
                                name="document_number"
                                control={control}
                                rules={{ required: "El número de documento es requerido" }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Número de Documento *
                                        </label>
                                        <InputText
                                            id={field.name}
                                            className={classNames("w-100", {
                                                "p-invalid": errors.document_number,
                                            })}
                                            {...field}
                                        />
                                    </>
                                )}
                            />
                            {getFormErrorMessage("document_number")}
                        </div>

                        {
                            watch("document_type") === "NIT" && initialData === undefined && !initialData?.isEditing && (
                                <div className={watch("document_type") === 'NIT' && initialData === undefined && !initialData?.isEditing ? 'col-4' : 'd-none'}>
                                    <Controller
                                        name="dv"
                                        control={control}
                                        rules={{ required: watch("document_type") === "NIT" }}
                                        render={({ field }) => (
                                            <>
                                                <label htmlFor={field.name} className="form-label">
                                                    DV *
                                                </label>
                                                <InputText
                                                    id={field.name}
                                                    className={classNames("w-100", {
                                                        "p-invalid": errors.dv,
                                                    })}
                                                    {...field}
                                                />
                                            </>
                                        )}
                                    />
                                    {getFormErrorMessage("dv")}
                                </div>
                            )

                        }

                    </div>

                    <div className="mb-3">
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "El email es requerido",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido",
                                },
                            }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor={field.name} className="form-label">
                                        Email *
                                    </label>
                                    <InputText
                                        id={field.name}
                                        className={classNames("w-100", {
                                            "p-invalid": errors.email,
                                        })}
                                        {...field}
                                    />
                                </>
                            )}
                        />
                        {getFormErrorMessage("email")}
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="col-md-6">
                    <div className="mb-3">
                        <Controller
                            name="address"
                            control={control}
                            rules={{ required: "La dirección es requerida" }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor={field.name} className="form-label">
                                        Dirección *
                                    </label>
                                    <InputText
                                        id={field.name}
                                        className={classNames("w-100", {
                                            "p-invalid": errors.address,
                                        })}
                                        {...field}
                                    />
                                </>
                            )}
                        />
                        {getFormErrorMessage("address")}
                    </div>

                    <div className="mb-3">
                        <Controller
                            name="phone"
                            control={control}
                            rules={{ required: "El teléfono es requerido" }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor={field.name} className="form-label">
                                        Teléfono *
                                    </label>
                                    <InputText
                                        id={field.name}
                                        className={classNames("w-100", {
                                            "p-invalid": errors.phone,
                                        })}
                                        {...field}
                                    />
                                </>
                            )}
                        />
                        {getFormErrorMessage("phone")}
                    </div>

                    {/* Selector de País */}
                    <div className="mb-3">
                        <Controller
                            name="country_id"
                            control={control}
                            rules={{ required: "El país es requerido" }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor="country_id" className="form-label">
                                        País *
                                    </label>
                                    <Dropdown
                                        id="country_id"
                                        value={field.value}
                                        options={countryOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            handleCountryChange(e.value);
                                        }}
                                        className={classNames("w-100", {
                                            "p-invalid": errors.country_id,
                                        })}
                                        placeholder="Selecciona un país"
                                        loading={locationLoading}
                                        filter
                                        filterBy="label"
                                        showClear
                                    />
                                </>
                            )}
                        />
                        {getFormErrorMessage("country_id")}
                    </div>

                    {/* Selector de Departamento */}
                    <div className="mb-3">
                        <Controller
                            name="department_id"
                            control={control}
                            rules={{ required: "El departamento es requerido" }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor="department_id" className="form-label">
                                        Departamento *
                                    </label>
                                    <Dropdown
                                        id="department_id"
                                        value={field.value}
                                        options={departmentOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            handleDepartmentChange(e.value);
                                        }}
                                        className={classNames("w-100", {
                                            "p-invalid": errors.department_id,
                                        })}
                                        placeholder="Selecciona un departamento"
                                        loading={locationLoading}
                                        disabled={!watchCountry}
                                        filter
                                        filterBy="label"
                                        showClear
                                    />
                                </>
                            )}
                        />
                        {getFormErrorMessage("department_id")}
                    </div>

                    {/* Selector de Ciudad */}
                    <div className="mb-3">
                        <Controller
                            name="city_id"
                            control={control}
                            rules={{ required: "La ciudad es requerida" }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor="city_id" className="form-label">
                                        Ciudad *
                                    </label>
                                    <Dropdown
                                        id="city_id"
                                        value={field.value}
                                        options={cityOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            handleCityChange(e.value);
                                        }}
                                        className={classNames("w-100", {
                                            "p-invalid": errors.city_id,
                                        })}
                                        placeholder="Selecciona una ciudad"
                                        loading={locationLoading}
                                        disabled={!watchDepartment}
                                        filter
                                        filterBy="label"
                                        showClear
                                    />
                                </>
                            )}
                        />
                        {getFormErrorMessage("city_id")}
                    </div>
                </div>
            </div>

            <hr className="my-4" />
            <h5 className="mb-3">Información Facturación Electrónica</h5>
            <div className="row pb-5">

                {
                    initialData === undefined && !initialData?.isEditing && (
                        <>
                            <div className="col-md-4">
                                <Controller
                                    name="type_organization_id"
                                    control={control}
                                    rules={{ required: "La organización es requerida" }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor="type_organization_id" className="form-label">
                                                Tipo de Organización *
                                            </label>
                                            <Dropdown
                                                id={field.name}
                                                options={organizationTypes}
                                                optionLabel="name"
                                                optionValue="id"
                                                className={classNames("w-100", {
                                                    "p-invalid": errors.type_organization_id,
                                                })}
                                                {...field}
                                                placeholder="Selecciona un tipo de organización"
                                                required
                                                filter
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage("type_organization_id")}
                            </div>
                            <div className="col-md-4">
                                <Controller
                                    name="type_liability_id"
                                    control={control}
                                    rules={{ required: "El agente retenedor es requerido" }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor="type_liability_id" className="form-label">
                                                Agente retenedor *
                                            </label>
                                            <Dropdown
                                                id={field.name}
                                                options={liabilityTypes}
                                                optionLabel="name"
                                                optionValue="id"
                                                className={classNames("w-100", {
                                                    "p-invalid": errors.type_liability_id,
                                                })}
                                                {...field}
                                                placeholder="Selecciona un agente retenedor"
                                                required
                                                filter
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage("type_liability_id")}
                            </div>
                            <div className="col-md-4">
                                <Controller
                                    name="type_regime_id"
                                    control={control}
                                    rules={{ required: "El tipo de régimen es requerido" }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor="regime_type" className="form-label">
                                                Tipo de régimen *
                                            </label>
                                            <Dropdown
                                                id={field.name}
                                                options={regimeTypes}
                                                optionLabel="name"
                                                optionValue="id"
                                                className={classNames("w-100", {
                                                    "p-invalid": errors.type_regime_id,
                                                })}
                                                {...field}
                                                placeholder="Selecciona un tipo de régimen"
                                                required
                                                filter
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage("type_regime_id")}
                            </div>
                        </>


                    )
                }

                <div className="col-md-6">
                    <label htmlFor="operation_type_id" className="form-label fw-bold">Tipo de Operación</label>
                    <Controller
                        name="operation_type_id"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id={field.name}
                                {...field}
                                optionLabel="name"
                                optionValue="id"
                                options={operationTypes}
                                placeholder="Seleccione el tipo de operación"
                                className={classNames("w-100", {
                                    "p-invalid": errors.operation_type_id,
                                })}
                            />
                        )}
                    />
                    {getFormErrorMessage('operation_type_id')}
                </div>

                <div className="col-md-6">
                    <label htmlFor="coverage_type_id" className="form-label fw-bold">Tipo de Cobertura</label>
                    <Controller
                        name="coverage_type_id"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id={field.name}
                                {...field}
                                optionLabel="name"
                                optionValue="id"
                                options={coverageTypes}
                                placeholder="Seleccione el tipo de cobertura"
                                className={classNames("w-100", {
                                    "p-invalid": errors.coverage_type_id,
                                })}
                            />
                        )}
                    />
                    {getFormErrorMessage('coverage_type_id')}
                </div>

                <div className="col-md-6">
                    <label htmlFor="payment_method_id" className="form-label fw-bold">Metodo de pago</label>
                    <Controller
                        name="payment_method_id"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id={field.name}
                                {...field}
                                optionLabel="name"
                                optionValue="id"
                                options={paymentMethods}
                                placeholder="Seleccione el metodo de pago"
                                className={classNames("w-100", {
                                    "p-invalid": errors.payment_method_id,
                                })}
                            />
                        )}
                    />
                    {getFormErrorMessage('payment_method_id')}
                </div>

                <div className="col-md-6">
                    <label htmlFor="contract_number" className="form-label fw-bold">Numero de contrato</label>
                    <Controller
                        name="contract_number"
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputNumber
                                id={field.name}
                                value={field.value}
                                onValueChange={(e) => field.onChange(e.value)}
                                useGrouping={false}
                                min={0}
                                placeholder="Ingrese el numero de contrato"
                                className={classNames("w-100", {
                                    "p-invalid": errors.contract_number,
                                })}
                            />
                        )}
                    />
                    {getFormErrorMessage('contract_number')}
                </div>

                <div className="col-md-6">
                    <label htmlFor="poliza_number" className="form-label fw-bold">Numero de poliza</label>
                    <Controller
                        name="poliza_number"
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputNumber
                                id={field.name}
                                value={field.value}
                                onValueChange={(e) => field.onChange(e.value)}
                                useGrouping={false}
                                placeholder="Ingrese el numero de poliza"
                                className={classNames("w-100", {
                                    "p-invalid": errors.poliza_number,
                                })}
                            />
                        )}
                    />
                    {getFormErrorMessage('poliza_number')}
                </div>

            </div>

            <div className="d-flex justify-content-center mt-4 gap-6">
                {onCancel && (
                    <Button
                        label="Cancelar"
                        className="btn btn-phoenix-secondary"
                        onClick={onCancel}
                        style={{ padding: "0 20px", width: "200px", height: "50px", borderRadius: "0px" }}
                        type="button"
                        disabled={loading}
                    >
                        <i className="fas fa-times"></i>
                    </Button>
                )}
                <Button
                    type="submit"
                    label="Guardar"
                    className="p-button-sm"
                    disabled={loading}
                    style={{
                        padding: "0 40px",
                        width: "200px",
                        height: "50px",
                        borderRadius: "0px",
                    }}
                >
                    <i className="fas fa-save"></i>
                </Button>
            </div>
        </form>
    );
};

export default EntitiesConfigForm;