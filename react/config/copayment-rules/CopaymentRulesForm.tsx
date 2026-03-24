import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import { copaymentRulesService } from "../../../services/api";

interface FormData {
  regimeType: string;
  attentionType: string;
  affiliateType: string;
  level: string;
  category: string;
  valueType: string;
  value: number;
}

export const CopaymentRulesForm: React.FC<any> = ({
  companyId = null,
  onSave = () => {},
  dataToEdit = null,
}) => {
  const toast = React.useRef<Toast>(null);

  const regimeTypes = [
    { value: "contributory", label: "Contributivo" },
    { value: "subsidiary", label: "Subsidiado" },
  ];

  const attentionTypes = [
    { value: "consultation", label: "Consulta" },
    { value: "procedure", label: "Procedimiento" },
  ];

  const levelOptions = [
    { value: "1", label: "Nivel 1" },
    { value: "2", label: "Nivel 2" },
  ];

  const categoryOptions = [
    { value: "A", label: "Categoría A" },
    { value: "B", label: "Categoría B" },
    { value: "C", label: "Categoría C" },
  ];

  const affiliateTypes = [
    { value: "1", label: "Cotizante" },
    { value: "2", label: "Benefeciario" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      regimeType: "",
      attentionType: "",
      affiliateType: "",
      level: "",
      category: "",
      valueType: "fixed",
      value: 0,
    },
  });

  useEffect(() => {
      if (dataToEdit) {
        setValue("regimeType", dataToEdit.regime_type);
        setValue("attentionType", dataToEdit.attention_type);
        setValue("affiliateType", dataToEdit.affiliate_type);
        setValue("level", dataToEdit.level);
        setValue("category", dataToEdit.category);
        setValue("valueType", dataToEdit.value_type);
        setValue("value", Number(dataToEdit.value));
      }
    }, [dataToEdit]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      id: dataToEdit?.id || null,
      regime_type: data.regimeType,
      attention_type: data.attentionType,
      affiliate_type:
        data.regimeType === "contributory" ? data.affiliateType : "",
      category: data.regimeType === "contributory" ? data.category : "",
      value_type:
        data.attentionType === "consultation" ? "fixed" : "percentage",
      value: data.value.toFixed(2),
      level: data.regimeType === "subsidiary" ? data.level : "",
      is_copayment_entity: false,
      company_id: companyId,
    };
    onSave(payload);
  };

  const getFormErrorMessage = (fieldName: keyof FormData) => {
    return (
      errors[fieldName] && (
        <small className="p-error">{errors[fieldName]?.message}</small>
      )
    );
  };

  return (
    <>
      <Card title="Reglas para copagos">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-fluid row g-3">
            <div className="col-md-6">
              <label htmlFor="regimeType">Régimen</label>
              <Controller
                name="regimeType"
                control={control}
                rules={{ required: "El régimen es requerido" }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={regimeTypes}
                      placeholder="Seleccione un régimen"
                      className={classNames({ "p-invalid": fieldState.error })}
                    />
                    {getFormErrorMessage("regimeType")}
                  </>
                )}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="attentionType">Tipo de atención</label>
              <Controller
                name="attentionType"
                control={control}
                rules={{ required: "El tipo de atención es requerido" }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={attentionTypes}
                      placeholder="Seleccione un tipo de atención"
                      className={classNames({ "p-invalid": fieldState.error })}
                    />
                    {getFormErrorMessage("attentionType")}
                  </>
                )}
              />
            </div>

            {watch("regimeType") === "contributory" && (
              <>
                <div className="col-md-6">
                  <label htmlFor="affiliateType">Tipo de afiliación</label>
                  <Controller
                    name="affiliateType"
                    control={control}
                    rules={{ required: "La categoría es requerida" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          options={affiliateTypes}
                          placeholder="Seleccione un tipo de afiliación"
                          className={classNames({
                            "p-invalid": fieldState.error,
                          })}
                        />
                        {getFormErrorMessage("affiliateType")}
                      </>
                    )}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="category">Categoría</label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "La categoría es requerida" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          options={categoryOptions}
                          placeholder="Seleccione una categoría"
                          className={classNames({
                            "p-invalid": fieldState.error,
                          })}
                        />
                        {getFormErrorMessage("category")}
                      </>
                    )}
                  />
                </div>

                {watch("attentionType") === "consultation" && (
                  <div className="col-md-6">
                    <label htmlFor="value">Valor</label>
                    <Controller
                      name="value"
                      control={control}
                      rules={{
                        required: "El valor es requerido",
                        min: {
                          value: 0,
                          message: "El valor debe ser mayor a 0",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputNumber
                            id={field.name}
                            value={field.value}
                            onValueChange={(e) => field.onChange(e.value)}
                            className={classNames({
                              "p-invalid": fieldState.error,
                            })}
                          />
                          {getFormErrorMessage("value")}
                        </>
                      )}
                    />
                  </div>
                )}

                {watch("attentionType") === "procedure" && (
                  <div className="col-md-6">
                    <label htmlFor="value">Valor</label>
                    <Controller
                      name="value"
                      control={control}
                      rules={{
                        required: "El valor es requerido",
                        min: {
                          value: 0,
                          message: "El valor debe ser mayor a 0",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputNumber
                            id={field.name}
                            value={field.value}
                            prefix="%"
                            min={0}
                            max={100}
                            onValueChange={(e) => field.onChange(e.value)}
                            className={classNames({
                              "p-invalid": fieldState.error,
                            })}
                          />
                          {getFormErrorMessage("value")}
                        </>
                      )}
                    />
                  </div>
                )}
              </>
            )}

            {watch("regimeType") === "subsidiary" && (
              <div className="col-md-6">
                <label htmlFor="level">Nivel</label>
                <Controller
                  name="level"
                  control={control}
                  rules={{ required: "El nivel es requerido" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={levelOptions}
                        placeholder="Seleccione un nivel"
                        className={classNames({
                          "p-invalid": fieldState.error,
                        })}
                      />
                      {getFormErrorMessage("level")}
                    </>
                  )}
                />
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3">
            <Button type="submit" label="Guardar">
              <i className="fa fa-save me-2" style={{ marginLeft: "10px" }}></i>
            </Button>
          </div>
        </form>
      </Card>
      <Toast ref={toast} />
    </>
  );
};
