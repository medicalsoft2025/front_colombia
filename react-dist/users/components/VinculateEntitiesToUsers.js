function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import { MultiSelect } from 'primereact/multiselect';
import { resourcesAdminService, entitiesService, entitiesUserService } from "../../../services/api/index.js";
export const VinculateEntitiesToUsers = ({
  onSuccess,
  userId,
  toast
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: {
      entityIds: [],
      operationType: "",
      coverageType: "",
      paymentMethod: "",
      documentType: "",
      userType: 0,
      contractNumber: "",
      polizaNumber: ""
    }
  });
  const [entities, setEntities] = useState([]);
  const [operationTypes, setOperationTypes] = useState([]);
  const [coverageTypes, setCoverageTypes] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  useEffect(() => {
    loadResources();
  }, []);
  const onSubmit = async data => {
    const payload = {
      entity_ids: data.entityIds,
      user_id: userId,
      operation_type_id: data.operationType.toString(),
      coverage_type_id: data.coverageType.toString(),
      payment_method_id: data.paymentMethod.toString(),
      document_type_id: data.documentType.toString(),
      user_type_id: data.userType.toString(),
      contract_number: data.contractNumber?.toString(),
      poliza_number: data.polizaNumber?.toString()
    };
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
  const getFormErrorMessage = name => {
    return errors[name] ? /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message) : /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "\xA0");
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
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm p-0"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "entityIds",
    className: "form-label fw-bold"
  }, "Entidades"), /*#__PURE__*/React.createElement(Controller, {
    name: "entityIds",
    control: control,
    rules: {
      required: 'Entity type is required.'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(MultiSelect, _extends({
      id: field.name
    }, field, {
      options: entities,
      placeholder: "Seleccione la entidad",
      className: classNames({
        'p-invalid': fieldState.error
      }),
      optionLabel: "name",
      optionValue: "id",
      appendTo: document.body
    }))
  }), getFormErrorMessage('entityIds')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "operationType",
    className: "form-label fw-bold"
  }, "Tipo de Operaci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "operationType",
    control: control,
    rules: {
      required: 'Operation type is required.'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name
    }, field, {
      optionLabel: "name",
      optionValue: "id",
      options: operationTypes,
      placeholder: "Seleccione el tipo de operaci\xF3n",
      className: classNames({
        'p-invalid': fieldState.error
      })
    }))
  }), getFormErrorMessage('operationType')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "coverageType",
    className: "form-label fw-bold"
  }, "Tipo de Cobertura"), /*#__PURE__*/React.createElement(Controller, {
    name: "coverageType",
    control: control,
    rules: {
      required: 'Coverage type is required.'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name
    }, field, {
      optionLabel: "name",
      optionValue: "id",
      options: coverageTypes,
      placeholder: "Seleccione el tipo de cobertura",
      className: classNames({
        'p-invalid': fieldState.error
      })
    }))
  }), getFormErrorMessage('coverageType')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "paymentMethod",
    className: "form-label fw-bold"
  }, "Metodo de pago"), /*#__PURE__*/React.createElement(Controller, {
    name: "paymentMethod",
    control: control,
    rules: {
      required: 'Payment method is required.'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name
    }, field, {
      optionLabel: "name",
      optionValue: "id",
      options: paymentMethods,
      placeholder: "Seleccione el metodo de pago",
      className: classNames({
        'p-invalid': fieldState.error
      })
    }))
  }), getFormErrorMessage('paymentMethod')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "documentType",
    className: "form-label fw-bold"
  }, "Tipo de documento"), /*#__PURE__*/React.createElement(Controller, {
    name: "documentType",
    control: control,
    rules: {
      required: 'Document type is required.'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name
    }, field, {
      optionLabel: "name",
      optionValue: "id",
      options: documentTypes,
      placeholder: "Seleccione el tipo de documento",
      className: classNames({
        'p-invalid': fieldState.error
      })
    }))
  }), getFormErrorMessage('documentType')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "userType",
    className: "form-label fw-bold"
  }, "Tipo de usuario"), /*#__PURE__*/React.createElement(Controller, {
    name: "userType",
    control: control,
    rules: {
      required: 'Document type is required.'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name
    }, field, {
      optionLabel: "name",
      optionValue: "id",
      options: userTypes,
      placeholder: "Seleccione el tipo de usuario",
      className: classNames({
        'p-invalid': fieldState.error
      })
    }))
  }), getFormErrorMessage('userType')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contractNumber",
    className: "form-label fw-bold"
  }, "Numero de contrato"), /*#__PURE__*/React.createElement(Controller, {
    name: "contractNumber",
    control: control,
    rules: {
      required: 'Contract number is required.'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      useGrouping: false,
      min: 0,
      placeholder: "Ingrese el numero de contrato",
      className: classNames({
        'p-invalid': fieldState.error
      })
    })
  }), getFormErrorMessage('contractNumber')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "polizaNumber",
    className: "form-label fw-bold"
  }, "Numero de poliza"), /*#__PURE__*/React.createElement(Controller, {
    name: "polizaNumber",
    control: control,
    rules: {
      required: 'Poliza number is required.'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      useGrouping: false,
      placeholder: "Ingrese el numero de poliza",
      className: classNames({
        'p-invalid': fieldState.error
      })
    })
  }), getFormErrorMessage('polizaNumber')), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-secondary p-button-outlined",
    onClick: () => {
      reset();
      onSuccess();
    }
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    icon: "pi pi-check",
    className: "p-button-primary"
  }))))));
};