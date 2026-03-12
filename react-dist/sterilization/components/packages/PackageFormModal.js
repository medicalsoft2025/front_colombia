function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';
export const PackageFormModal = props => {
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
    header: initialData ? "Editar Paquete" : "Nuevo Paquete",
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
    className: "col-12 col-md-9"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    className: "form-label"
  }, "Nombre ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: 'El nombre es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: `w-100 ${errors.name ? 'p-invalid' : ''}`
    }))
  }), errors.name && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.name.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "prefix",
    className: "form-label"
  }, "Prefijo ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "prefix",
    control: control,
    rules: {
      required: 'El prefijo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: `w-100 ${errors.prefix ? 'p-invalid' : ''}`
    }))
  }), errors.prefix && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.prefix.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "content",
    className: "form-label"
  }, "Contenido ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "content",
    control: control,
    rules: {
      required: 'El contenido es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: `w-100 ${errors.content ? 'p-invalid' : ''}`
    }))
  }), errors.content && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.content.message))));
};