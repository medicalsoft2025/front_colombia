function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';
import { MEDICATION_STATEMENT_STATUS_OPTIONS } from "../consts/status.js";
import { medicationService } from "../../prescriptions/services/MedicationService.js";
export const MedicationStatementFormModal = props => {
  const {
    visible,
    onHide,
    onSave,
    initialData,
    saving
  } = props;
  const [medicines, setMedicines] = useState([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
      isValid
    }
  } = useForm({
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
  const onSubmit = data => {
    onSave({
      ...data,
      notes: null
    });
  };
  const handleMedicationChange = val => {
    if (val) {
      setValue('medicationId', Number(val.id || val.Codigo));
      setValue('medicationName', val.descripcion);
    } else {
      setValue('medicationId', null);
      setValue('medicationName', '');
    }
  };
  const dialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-2"
    }),
    severity: "secondary",
    onClick: onHide,
    disabled: saving,
    type: "button"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: `fa ${saving ? 'fa-spinner fa-spin' : 'fa-save'} me-2`
    }),
    onClick: handleSubmit(onSubmit),
    disabled: saving || !isValid,
    type: "button"
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: initialData ? "Editar Medicamento" : "Nuevo Medicamento",
    visible: visible,
    onHide: onHide,
    style: {
      width: '50vw'
    },
    breakpoints: {
      '960px': '75vw',
      '641px': '100vw'
    },
    footer: dialogFooter
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "medicationId",
    className: "form-label"
  }, "Medicamento ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "medicationId",
    control: control,
    rules: {
      required: 'La selección de medicamento es requerida'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: medicines.find(m => Number(m.id || m.Codigo) === field.value),
      onChange: e => handleMedicationChange(e.value),
      options: medicines,
      optionLabel: "descripcion",
      filter: true,
      loading: loadingMedicines,
      placeholder: "Busque y seleccione un medicamento",
      className: `w-100 ${errors.medicationId ? 'p-invalid' : ''}`,
      virtualScrollerOptions: {
        itemSize: 38
      }
    })
  }), errors.medicationId && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.medicationId.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dosage",
    className: "form-label"
  }, "Dosis / Frecuencia"), /*#__PURE__*/React.createElement(Controller, {
    name: "dosage",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      value: field.value || '',
      placeholder: "Ej: 1 cada 8 horas",
      className: `w-100 ${errors.dosage ? 'p-invalid' : ''}`
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "status",
    className: "form-label"
  }, "Estado ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "status",
    control: control,
    rules: {
      required: 'El estado es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: MEDICATION_STATEMENT_STATUS_OPTIONS,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione un estado",
      className: `w-100 ${errors.status ? 'p-invalid' : ''}`
    })
  }), errors.status && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.status.message))));
};