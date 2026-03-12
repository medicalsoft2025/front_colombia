function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { documentTypes as documentTypesConstant } from "../interfaces/constant.js";
import useLocationDropdowns from "../../../cities/hooks/useLocationDropdowns.js";
import { resourcesAdminService } from "../../../../services/api/index.js";
import { InputNumber } from "primereact/inputnumber";
const EntitiesConfigForm = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    setValue,
    watch
  } = useForm({
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
      isEditing: false
    }
  });
  const [operationTypes, setOperationTypes] = useState([]);
  const [coverageTypes, setCoverageTypes] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
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
    loading: locationLoading
  } = useLocationDropdowns();
  const [isInitialized, setIsInitialized] = useState(false);
  const [organizationTypes, setOrganizationTypes] = useState([]);
  const [liabilityTypes, setLiabilityTypes] = useState([]);
  const [regimeTypes, setRegimeTypes] = useState([]);
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
  const onFormSubmit = data => {
    onSubmit({
      ...data,
      country_id: data.country_id,
      department_id: data.department_id,
      city_id: data.city_id
    });
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
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
      setValue("country_id", selectedCountry, {
        shouldValidate: true
      });
    }
  }, [selectedCountry, setValue]);
  useEffect(() => {
    if (selectedDepartment) {
      setValue("department_id", selectedDepartment, {
        shouldValidate: true
      });
    }
  }, [selectedDepartment, setValue]);
  useEffect(() => {
    if (selectedCity) {
      setValue("city_id", selectedCity, {
        shouldValidate: true
      });
    }
  }, [selectedCity, setValue]);
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onFormSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Nombre *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.name
      })
    }, field)))
  }), getFormErrorMessage("name")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "entity_code",
    control: control,
    rules: {
      required: "El código es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "C\xF3digo *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.entity_code
      })
    }, field)))
  }), getFormErrorMessage("entity_code")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "document_type",
    control: control,
    rules: {
      required: "El tipo de documento es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de Documento *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: documentTypesConstant,
      optionLabel: "label",
      optionValue: "value",
      className: classNames("w-100", {
        "p-invalid": errors.document_type
      })
    }, field)))
  }), getFormErrorMessage("document_type")), /*#__PURE__*/React.createElement("div", {
    className: watch("document_type") === 'NIT' && initialData === undefined && !initialData?.isEditing ? 'row col-md-12 align-items-center' : 'mb-3'
  }, /*#__PURE__*/React.createElement("div", {
    className: watch("document_type") === 'NIT' && initialData === undefined && !initialData?.isEditing ? 'col-8' : 'mb-3'
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "document_number",
    control: control,
    rules: {
      required: "El número de documento es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "N\xFAmero de Documento *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.document_number
      })
    }, field)))
  }), getFormErrorMessage("document_number")), watch("document_type") === "NIT" && initialData === undefined && !initialData?.isEditing && /*#__PURE__*/React.createElement("div", {
    className: watch("document_type") === 'NIT' && initialData === undefined && !initialData?.isEditing ? 'col-4' : 'd-none'
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "dv",
    control: control,
    rules: {
      required: watch("document_type") === "NIT"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "DV *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.dv
      })
    }, field)))
  }), getFormErrorMessage("dv"))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      required: "El email es requerido",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Email inválido"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Email *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.email
      })
    }, field)))
  }), getFormErrorMessage("email"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "address",
    control: control,
    rules: {
      required: "La dirección es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Direcci\xF3n *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.address
      })
    }, field)))
  }), getFormErrorMessage("address")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    rules: {
      required: "El teléfono es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tel\xE9fono *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.phone
      })
    }, field)))
  }), getFormErrorMessage("phone")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "country_id",
    control: control,
    rules: {
      required: "El país es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "country_id",
      className: "form-label"
    }, "Pa\xEDs *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: "country_id",
      value: field.value,
      options: countryOptions,
      optionLabel: "label",
      optionValue: "value",
      onChange: e => {
        field.onChange(e.value);
        handleCountryChange(e.value);
      },
      className: classNames("w-100", {
        "p-invalid": errors.country_id
      }),
      placeholder: "Selecciona un pa\xEDs",
      loading: locationLoading,
      filter: true,
      filterBy: "label",
      showClear: true
    }))
  }), getFormErrorMessage("country_id")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "department_id",
    control: control,
    rules: {
      required: "El departamento es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "department_id",
      className: "form-label"
    }, "Departamento *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: "department_id",
      value: field.value,
      options: departmentOptions,
      optionLabel: "label",
      optionValue: "value",
      onChange: e => {
        field.onChange(e.value);
        handleDepartmentChange(e.value);
      },
      className: classNames("w-100", {
        "p-invalid": errors.department_id
      }),
      placeholder: "Selecciona un departamento",
      loading: locationLoading,
      disabled: !watchCountry,
      filter: true,
      filterBy: "label",
      showClear: true
    }))
  }), getFormErrorMessage("department_id")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "city_id",
    control: control,
    rules: {
      required: "La ciudad es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "city_id",
      className: "form-label"
    }, "Ciudad *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: "city_id",
      value: field.value,
      options: cityOptions,
      optionLabel: "label",
      optionValue: "value",
      onChange: e => {
        field.onChange(e.value);
        handleCityChange(e.value);
      },
      className: classNames("w-100", {
        "p-invalid": errors.city_id
      }),
      placeholder: "Selecciona una ciudad",
      loading: locationLoading,
      disabled: !watchDepartment,
      filter: true,
      filterBy: "label",
      showClear: true
    }))
  }), getFormErrorMessage("city_id")))), /*#__PURE__*/React.createElement("hr", {
    className: "my-4"
  }), /*#__PURE__*/React.createElement("h5", {
    className: "mb-3"
  }, "Informaci\xF3n Facturaci\xF3n Electr\xF3nica"), /*#__PURE__*/React.createElement("div", {
    className: "row pb-5"
  }, initialData === undefined && !initialData?.isEditing && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "type_organization_id",
    control: control,
    rules: {
      required: "La organización es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "type_organization_id",
      className: "form-label"
    }, "Tipo de Organizaci\xF3n *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: organizationTypes,
      optionLabel: "name",
      optionValue: "id",
      className: classNames("w-100", {
        "p-invalid": errors.type_organization_id
      })
    }, field, {
      placeholder: "Selecciona un tipo de organizaci\xF3n",
      required: true,
      filter: true
    })))
  }), getFormErrorMessage("type_organization_id")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "type_liability_id",
    control: control,
    rules: {
      required: "El agente retenedor es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "type_liability_id",
      className: "form-label"
    }, "Agente retenedor *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: liabilityTypes,
      optionLabel: "name",
      optionValue: "id",
      className: classNames("w-100", {
        "p-invalid": errors.type_liability_id
      })
    }, field, {
      placeholder: "Selecciona un agente retenedor",
      required: true,
      filter: true
    })))
  }), getFormErrorMessage("type_liability_id")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "type_regime_id",
    control: control,
    rules: {
      required: "El tipo de régimen es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "regime_type",
      className: "form-label"
    }, "Tipo de r\xE9gimen *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: regimeTypes,
      optionLabel: "name",
      optionValue: "id",
      className: classNames("w-100", {
        "p-invalid": errors.type_regime_id
      })
    }, field, {
      placeholder: "Selecciona un tipo de r\xE9gimen",
      required: true,
      filter: true
    })))
  }), getFormErrorMessage("type_regime_id"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "operation_type_id",
    className: "form-label fw-bold"
  }, "Tipo de Operaci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "operation_type_id",
    control: control,
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
      className: classNames("w-100", {
        "p-invalid": errors.operation_type_id
      })
    }))
  }), getFormErrorMessage('operation_type_id')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "coverage_type_id",
    className: "form-label fw-bold"
  }, "Tipo de Cobertura"), /*#__PURE__*/React.createElement(Controller, {
    name: "coverage_type_id",
    control: control,
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
      className: classNames("w-100", {
        "p-invalid": errors.coverage_type_id
      })
    }))
  }), getFormErrorMessage('coverage_type_id')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "payment_method_id",
    className: "form-label fw-bold"
  }, "Metodo de pago"), /*#__PURE__*/React.createElement(Controller, {
    name: "payment_method_id",
    control: control,
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
      className: classNames("w-100", {
        "p-invalid": errors.payment_method_id
      })
    }))
  }), getFormErrorMessage('payment_method_id')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contract_number",
    className: "form-label fw-bold"
  }, "Numero de contrato"), /*#__PURE__*/React.createElement(Controller, {
    name: "contract_number",
    control: control,
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
      className: classNames("w-100", {
        "p-invalid": errors.contract_number
      })
    })
  }), getFormErrorMessage('contract_number')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "poliza_number",
    className: "form-label fw-bold"
  }, "Numero de poliza"), /*#__PURE__*/React.createElement(Controller, {
    name: "poliza_number",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      useGrouping: false,
      placeholder: "Ingrese el numero de poliza",
      className: classNames("w-100", {
        "p-invalid": errors.poliza_number
      })
    })
  }), getFormErrorMessage('poliza_number'))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center mt-4 gap-6"
  }, onCancel && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-phoenix-secondary",
    onClick: onCancel,
    style: {
      padding: "0 20px",
      width: "200px",
      height: "50px",
      borderRadius: "0px"
    },
    type: "button",
    disabled: loading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times"
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    className: "p-button-sm",
    disabled: loading,
    style: {
      padding: "0 40px",
      width: "200px",
      height: "50px",
      borderRadius: "0px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }))));
};
export default EntitiesConfigForm;