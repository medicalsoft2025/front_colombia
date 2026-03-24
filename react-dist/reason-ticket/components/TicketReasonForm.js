function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ticketReasonTypeOptions } from "../consts.js";
export const TicketReasonForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {
      errors
    },
    watch
  } = useForm({
    defaultValues: {
      key: '',
      label: '',
      tag: 'RC',
      is_active: true
    }
  });
  const toast = useRef(null);
  useEffect(() => {
    reset(initialData ?? {
      key: '',
      label: '',
      tag: '',
      is_active: true
    });
  }, [initialData, reset]);
  const showError = message => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error de validación',
      detail: message,
      life: 5000
    });
  };
  const onSubmit = data => {
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit),
    className: "container-fluid p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "key"
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, _extends({
    id: "key"
  }, register('key', {
    required: 'Tipo es requerido'
  }), {
    options: ticketReasonTypeOptions,
    optionLabel: "label",
    optionValue: "value",
    placeholder: "Seleccione un tipo",
    className: `w-100 ${errors.key ? 'is-invalid' : ''}`
  })), errors.key && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback"
  }, errors.key.message)), /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "label"
  }, "Titulo"), /*#__PURE__*/React.createElement(InputText, _extends({
    id: "label"
  }, register('label', {
    required: 'Titulo es requerido'
  }), {
    placeholder: "Razon Consulta",
    className: `form-control ${errors.label ? 'is-invalid' : ''}`
  })), errors.label && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback"
  }, errors.label.message)), /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tag"
  }, "Etiqueta"), /*#__PURE__*/React.createElement(InputText, _extends({
    id: "tag"
  }, register('tag', {
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
  }), {
    placeholder: "RC",
    className: `form-control ${errors.tag ? 'is-invalid' : ''}`
  })), errors.tag && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback"
  }, errors.tag.message), /*#__PURE__*/React.createElement("small", {
    className: "form-text text-muted"
  }, tagValue?.length || 0, "/5 caracteres", tagValue && tagValue.length > 5 && /*#__PURE__*/React.createElement("span", {
    className: "text-danger ms-2"
  }, "(M\xE1ximo 5 caracteres)"))), /*#__PURE__*/React.createElement("div", {
    className: "form-check mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "is_active",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Checkbox, {
      inputId: "is_active",
      checked: field.value,
      onChange: e => field.onChange(e.checked)
    })
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "is_active",
    className: "form-check-label ms-2"
  }, "Activo"))));
};