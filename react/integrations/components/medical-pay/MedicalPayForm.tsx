import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { PrimeReactProvider } from "primereact/api";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

interface FormData {
  tenant: string;
  bankOnePayId: string;
  document: string;
  documentType: string;
  fullName: string;
  phone: string;
  address: string;
  email: string;
  currentBalance: number;
  clientType: string;
}

export const PatientDocumentsForm: React.FC<any> = ({
  onSave = () => {},
  dataToEdit = null,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      tenant: "",
      bankOnePayId: "",
      document: "",
      documentType: "",
      fullName: "",
      phone: "",
      address: "",
      email: "",
      currentBalance: 0,
      clientType: "",
    },
  });

  useEffect(() => {
    if (dataToEdit) {
      setValue("tenant", dataToEdit.tenant);
      setValue("bankOnePayId", dataToEdit.bankOnePayId);
      setValue("document", dataToEdit.document);
      setValue("documentType", dataToEdit.documentType);
      setValue("fullName", dataToEdit.fullName);
      setValue("phone", dataToEdit.phone);
      setValue("address", dataToEdit.address);
      setValue("email", dataToEdit.email);
      setValue("currentBalance", dataToEdit.currentBalance);
      setValue("clientType", dataToEdit.clientType);
    }
  }, [dataToEdit]);

  useEffect(() => {
    const tenant = window.location.hostname.split(".")[0];
    setValue("tenant", tenant);
    setValue("clientType", "JURIDICO");
  }, []);

  const onSubmit = async (data: any) => {
    const payload = {
      id: dataToEdit?.id || null,
      tenant: data.tenant,
      bankOnePayId: data.bankOnePayId,
      document: data.document,
      documentType: data.documentType,
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      email: data.email,
      currentBalance: data.currentBalance ?? 0,
      clientType: data.clientType,
    };
    onSave(payload);
  };

  return (
    <PrimeReactProvider>
      <Card title="Registro medical pay">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex flex-column gap-2">
            <div className="w-100">
              <label htmlFor="tenant">Tenant</label>
              <Controller
                name="tenant"
                control={control}
                rules={{ required: "Tenant es requerido" }}
                render={({ field }) => (
                  <InputText
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    disabled
                    className={classNames("w-100", {
                      "p-invalid": errors.tenant,
                    })}
                  />
                )}
              />
              {errors.tenant && (
                <small className="p-error">{errors.tenant.message}</small>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="bankOnePayId">Banco</label>
              <Controller
                name="bankOnePayId"
                control={control}
                rules={{ required: "Bank One Pay ID es requerido" }}
                render={({ field }) => (
                  <InputText
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    className={classNames("w-100", {
                      "p-invalid": errors.bankOnePayId,
                    })}
                  />
                )}
              />
              {errors.bankOnePayId && (
                <small className="p-error">{errors.bankOnePayId.message}</small>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="documentType">Tipo de Documento</label>
              <Controller
                name="documentType"
                control={control}
                rules={{ required: "Tipo de documento es requerido" }}
                render={({ field }) => (
                  <Dropdown
                    className="w-100"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={[
                      { label: "DNI", value: "DNI" },
                      { label: "RUC", value: "RUC" },
                      { label: "Pasaporte", value: "PASAPORTE" },
                      { label: "Cedula", value: "CC" },
                    ]}
                    placeholder="Seleccionar..."
                  />
                )}
              />
              {errors.documentType && (
                <small className="p-error">{errors.documentType.message}</small>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="document">Número de Documento</label>
              <Controller
                name="document"
                control={control}
                rules={{ required: "Número de documento es requerido" }}
                render={({ field }) => (
                  <InputText
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    className={classNames("w-100", {
                      "p-invalid": errors.document,
                    })}
                  />
                )}
              />
              {errors.document && (
                <small className="p-error">{errors.document.message}</small>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="fullName">Nombre Completo</label>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: "Nombre completo es requerido" }}
                render={({ field }) => (
                  <InputText
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    className={classNames("w-100", {
                      "p-invalid": errors.fullName,
                    })}
                  />
                )}
              />
              {errors.fullName && (
                <small className="p-error">{errors.fullName.message}</small>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="phone">Teléfono</label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: "Teléfono es requerido" }}
                render={({ field }) => (
                  <InputText
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    className={classNames("w-100", {
                      "p-invalid": errors.phone,
                    })}
                  />
                )}
              />
              {errors.phone && (
                <small className="p-error">{errors.phone.message}</small>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="address">Dirección</label>
              <Controller
                name="address"
                control={control}
                rules={{ required: "Dirección es requerida" }}
                render={({ field }) => (
                  <InputTextarea
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    rows={3}
                    className={classNames("w-100", {
                      "p-invalid": errors.address,
                    })}
                  />
                )}
              />
              {errors.address && (
                <small className="p-error">{errors.address.message}</small>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="email">Email</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                }}
                render={({ field }) => (
                  <InputText
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    className={classNames("w-100", {
                      "p-invalid": errors.email,
                    })}
                  />
                )}
              />
              {errors.email && (
                <small className="p-error">{errors.email.message}</small>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="clientType">Tipo de Cliente</label>
              <Controller
                name="clientType"
                control={control}
                rules={{ required: "Tipo de cliente es requerido" }}
                render={({ field }) => (
                  <Dropdown
                    className="w-100"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={[
                      { label: "Juridico", value: "JURIDICO" },
                      { label: "Natural", value: "NATURAL" },
                    ]}
                    placeholder="Seleccionar..."
                  />
                )}
              />
              {errors.clientType && (
                <small className="p-error">{errors.clientType.message}</small>
              )}
            </div>

            <div className="w-100 text-end">
              <Button
                type="submit"
                label={dataToEdit ? "Actualizar" : "Guardar"}
                icon="pi pi-save"
                className="p-button-primary"
              />
            </div>
          </div>
        </form>
      </Card>
    </PrimeReactProvider>
  );
};
