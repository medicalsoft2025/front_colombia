function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { useForm, Controller } from 'react-hook-form';
import { allergyStatuses, allergyTypes } from "../consts/index.js";
export const AllergyFormModal = props => {
  const {
    visible,
    onHide,
    onSave,
    initialData,
    saving
  } = props;
  const {
    control,
    handleSubmit,
    reset,
    formState: {
      errors,
      isValid
    }
  } = useForm({
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
  const onSubmit = data => {
    onSave(data);
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
    header: initialData ? "Editar Alergia" : "Nueva Alergia",
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
    htmlFor: "type",
    className: "form-label"
  }, "Tipo de alergia ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "type",
    control: control,
    rules: {
      required: 'El tipo de alergia es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: allergyTypes,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione el tipo de alergia",
      className: `w-100 ${errors.type ? 'p-invalid' : ''}`
    })
  }), errors.type && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.type.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "description",
    className: "form-label"
  }, "Descripci\xF3n de la alergia ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    rules: {
      required: 'La descripción es requerida'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name
    }, field, {
      rows: 3,
      placeholder: "Describa los s\xEDntomas del paciente frente a la alergia",
      className: `w-100 ${errors.description ? 'p-invalid' : ''}`
    }))
  }), errors.description && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.description.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "status",
    className: "form-label"
  }, "Estado de la alergia ", /*#__PURE__*/React.createElement("span", {
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
      options: allergyStatuses,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione un estado",
      className: `w-100 ${errors.status ? 'p-invalid' : ''}`
    })
  }), errors.status && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.status.message))));
};