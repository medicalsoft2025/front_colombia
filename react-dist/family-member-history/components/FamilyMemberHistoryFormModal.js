import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { familyMemberHistoryStatuses, relationshipCodes } from "../consts/index.js";
import { useSpecialty } from "../../fe-config/speciality/hooks/useSpecialty.js";
export const FamilyMemberHistoryFormModal = props => {
  const {
    visible,
    onHide,
    onSave,
    initialData,
    saving
  } = props;
  const {
    cie11Codes,
    loadCie11Codes
  } = useSpecialty();
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
      relationshipCode: '',
      cie11: '',
      status: ''
    }
  });
  useEffect(() => {
    if (visible) {
      if (initialData) {
        reset({
          relationshipCode: initialData.relationshipCode,
          cie11: initialData.cie11,
          status: initialData.status
        });
      } else {
        reset({
          relationshipCode: '',
          cie11: '',
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
    header: initialData ? "Editar Antecedente Familiar" : "Nuevo Antecedente Familiar",
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
    htmlFor: "relationshipCode",
    className: "form-label"
  }, "Tipo de familiar ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "relationshipCode",
    control: control,
    rules: {
      required: 'El tipo de familiar es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: relationshipCodes,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione el tipo de familiar",
      className: `w-100 ${errors.relationshipCode ? 'p-invalid' : ''}`
    })
  }), errors.relationshipCode && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.relationshipCode.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cie11",
    className: "form-label"
  }, "CIE11 ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "cie11",
    control: control,
    rules: {
      required: 'El CIE11 es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(AutoComplete, {
      id: field.name,
      value: field.value,
      suggestions: cie11Codes,
      completeMethod: e => loadCie11Codes(e.query),
      field: "label",
      onChange: e => {
        const val = typeof e.value === 'object' ? e.value.codigo : e.value;
        field.onChange(val);
      },
      placeholder: "Escriba un C\xF3digo o diagn\xF3stico CIE-11",
      className: `w-100 ${errors.cie11 ? 'p-invalid' : ''}`,
      inputClassName: "w-100",
      appendTo: "self",
      delay: 500,
      minLength: 3,
      showEmptyMessage: true,
      emptyMessage: "No se encontraron c\xF3digos CIE-11"
    })
  }), errors.cie11 && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.cie11.message)), /*#__PURE__*/React.createElement("div", {
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
      options: familyMemberHistoryStatuses,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione un estado",
      className: `w-100 ${errors.status ? 'p-invalid' : ''}`
    })
  }), errors.status && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.status.message))));
};