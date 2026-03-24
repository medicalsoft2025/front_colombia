import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ticketReasonTypeOptions } from '../consts';

export interface TicketReasonFormInputs {
  id?: number;
  key: string;
  label: string;
  tag: string;
  is_active: boolean;
}

interface TicketReasonFormProps {
  formId: string;
  onHandleSubmit: (data: TicketReasonFormInputs) => void;
  initialData?: TicketReasonFormInputs;
}

export const TicketReasonForm: React.FC<TicketReasonFormProps> = ({ formId, onHandleSubmit, initialData }) => {
  const { register, handleSubmit, reset, control, formState: { errors }, watch } = useForm<TicketReasonFormInputs>({
    defaultValues: {
      key: '',
      label: '',
      tag: 'RC',
      is_active: true,
    }
  });

  const toast = useRef<Toast>(null);

  useEffect(() => {
    reset(initialData ?? { key: '', label: '', tag: '', is_active: true });
  }, [initialData, reset]);

  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error de validación',
      detail: message,
      life: 5000
    });
  };

  const onSubmit: SubmitHandler<TicketReasonFormInputs> = (data) => {
    // Validación adicional para el tag
    if (!data.tag || data.tag.trim() === '') {
      showError('El tag no puede estar en blanco');
      return;
    }

    if (data.tag.length > 5) {
      showError('El tag no puede tener más de 5 caracteres');
      return;
    }

    onHandleSubmit(data);
  };

  // Watch para validación en tiempo real del tag
  const tagValue = watch('tag');

  return (
    <>
      <Toast ref={toast} />
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="container-fluid p-3">
        <div className="form-group mb-3">
          <label htmlFor="key">Tipo</label>
          <Dropdown
            id="key"
            {...register('key', {
              required: 'Tipo es requerido',
            })}
            options={ticketReasonTypeOptions}
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione un tipo"
            className={`w-100 ${errors.key ? 'is-invalid' : ''}`}
          />
          {errors.key && <div className="invalid-feedback">{errors.key.message}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="label">Titulo</label>
          <InputText
            id="label"
            {...register('label', { required: 'Titulo es requerido' })}
            placeholder="Razon Consulta"
            className={`form-control ${errors.label ? 'is-invalid' : ''}`}
          />
          {errors.label && <div className="invalid-feedback">{errors.label.message}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="tag">Etiqueta</label>
          <InputText
            id="tag"
            {...register('tag', {
              required: 'Etiqueta es requerido',
              minLength: {
                value: 1,
                message: 'El etiqueta no puede estar vacío'
              },
              maxLength: {
                value: 5,
                message: 'El etiqueta no puede tener más de 5 caracteres'
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'El etiqueta solo puede contener letras y números'
              }
            })}
            placeholder="RC"
            className={`form-control ${errors.tag ? 'is-invalid' : ''}`}
          />
          {errors.tag && <div className="invalid-feedback">{errors.tag.message}</div>}
          <small className="form-text text-muted">
            {tagValue?.length || 0}/5 caracteres
            {tagValue && tagValue.length > 5 && (
              <span className="text-danger ms-2">(Máximo 5 caracteres)</span>
            )}
          </small>
        </div>

        <div className="form-check mb-3">
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Checkbox inputId="is_active" checked={field.value} onChange={(e) => field.onChange(e.checked)} />
            )}
          />
          <label htmlFor="is_active" className="form-check-label ms-2">Activo</label>
        </div>
      </form>
    </>
  );
};