import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { PrimeReactProvider } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
export const PatientDocumentsForm = ({
  onSave = () => {},
  dataToEdit = null
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    watch,
    setValue,
    reset
  } = useForm({
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
      clientType: ""
    }
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
  const onSubmit = async data => {
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
      clientType: data.clientType
    };
    onSave(payload);
  };
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement(Card, {
    title: "Registro medical pay"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tenant"
  }, "Tenant"), /*#__PURE__*/React.createElement(Controller, {
    name: "tenant",
    control: control,
    rules: {
      required: "Tenant es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, {
      id: field.name,
      value: field.value,
      onChange: field.onChange,
      disabled: true,
      className: classNames("w-100", {
        "p-invalid": errors.tenant
      })
    })
  }), errors.tenant && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.tenant.message)), /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "bankOnePayId"
  }, "Banco"), /*#__PURE__*/React.createElement(Controller, {
    name: "bankOnePayId",
    control: control,
    rules: {
      required: "Bank One Pay ID es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, {
      id: field.name,
      value: field.value,
      onChange: field.onChange,
      className: classNames("w-100", {
        "p-invalid": errors.bankOnePayId
      })
    })
  }), errors.bankOnePayId && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.bankOnePayId.message)), /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "documentType"
  }, "Tipo de Documento"), /*#__PURE__*/React.createElement(Controller, {
    name: "documentType",
    control: control,
    rules: {
      required: "Tipo de documento es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      className: "w-100",
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: [{
        label: "DNI",
        value: "DNI"
      }, {
        label: "RUC",
        value: "RUC"
      }, {
        label: "Pasaporte",
        value: "PASAPORTE"
      }, {
        label: "Cedula",
        value: "CC"
      }],
      placeholder: "Seleccionar..."
    })
  }), errors.documentType && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.documentType.message)), /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "document"
  }, "N\xFAmero de Documento"), /*#__PURE__*/React.createElement(Controller, {
    name: "document",
    control: control,
    rules: {
      required: "Número de documento es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, {
      id: field.name,
      value: field.value,
      onChange: field.onChange,
      className: classNames("w-100", {
        "p-invalid": errors.document
      })
    })
  }), errors.document && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.document.message)), /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fullName"
  }, "Nombre Completo"), /*#__PURE__*/React.createElement(Controller, {
    name: "fullName",
    control: control,
    rules: {
      required: "Nombre completo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, {
      id: field.name,
      value: field.value,
      onChange: field.onChange,
      className: classNames("w-100", {
        "p-invalid": errors.fullName
      })
    })
  }), errors.fullName && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.fullName.message)), /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "phone"
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    rules: {
      required: "Teléfono es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, {
      id: field.name,
      value: field.value,
      onChange: field.onChange,
      className: classNames("w-100", {
        "p-invalid": errors.phone
      })
    })
  }), errors.phone && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.phone.message)), /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "address"
  }, "Direcci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "address",
    control: control,
    rules: {
      required: "Dirección es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, {
      id: field.name,
      value: field.value,
      onChange: field.onChange,
      rows: 3,
      className: classNames("w-100", {
        "p-invalid": errors.address
      })
    })
  }), errors.address && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.address.message)), /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email"
  }, "Email"), /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      required: "Email es requerido",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Email inválido"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, {
      id: field.name,
      value: field.value,
      onChange: field.onChange,
      className: classNames("w-100", {
        "p-invalid": errors.email
      })
    })
  }), errors.email && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.email.message)), /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "clientType"
  }, "Tipo de Cliente"), /*#__PURE__*/React.createElement(Controller, {
    name: "clientType",
    control: control,
    rules: {
      required: "Tipo de cliente es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      className: "w-100",
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: [{
        label: "Juridico",
        value: "JURIDICO"
      }, {
        label: "Natural",
        value: "NATURAL"
      }],
      placeholder: "Seleccionar..."
    })
  }), errors.clientType && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.clientType.message)), /*#__PURE__*/React.createElement("div", {
    className: "w-100 text-end"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: dataToEdit ? "Actualizar" : "Guardar",
    icon: "pi pi-save",
    className: "p-button-primary"
  }))))));
};