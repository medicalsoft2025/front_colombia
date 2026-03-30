import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { Message } from "primereact/message";
import { resourcesAdminService } from "../../../../services/api/index.js";
export const ThirdPartyModal = ({
  visible,
  onHide,
  onSubmit,
  onEdit,
  initialData,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    type: "client",
    organization_type: "",
    municipality_id: "",
    liability_type: "",
    regime_type: "",
    contact: {
      name: "",
      document_type: "CC",
      document_number: "",
      dv: "",
      email: "",
      phone: "",
      address: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      second_last_name: "",
      date_of_birth: null
    },
    medicalPay: {
      account_number: "",
      subtype: "",
      bank: "",
      bank_id: "",
      bank_name: ""
    }
  });
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [organizationTypes, setOrganizationTypes] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [liabilityTypes, setLiabilityTypes] = useState([]);
  const [regimeTypes, setRegimeTypes] = useState([]);
  const [banks, setBanks] = useState([]);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (visible && initialData) {
      setFormData({
        type: initialData.type,
        organization_type: Number(initialData.organization_type) || "",
        // Handle potential missing data for old records
        municipality_id: Number(initialData.municipality_id) || "",
        liability_type: Number(initialData.liability_type) || "",
        regime_type: Number(initialData.regime_type) || "",
        contact: {
          name: initialData.contact.name,
          document_type: initialData.contact.document_type,
          document_number: initialData.contact.document_number,
          dv: initialData.contact.dv,
          email: initialData.contact.email,
          phone: initialData.contact.phone,
          address: initialData.contact.address,
          first_name: initialData.contact.first_name,
          middle_name: initialData.contact.middle_name || "",
          last_name: initialData.contact.last_name,
          second_last_name: initialData.contact.second_last_name || "",
          date_of_birth: initialData.contact.date_of_birth
        },
        medicalPay: {
          account_number: initialData.medicalPay?.account_number || "",
          subtype: initialData.medicalPay?.subtype || "",
          bank: initialData.medicalPay?.bank || "",
          bank_id: initialData.medicalPay?.bank_id || "",
          bank_name: initialData.medicalPay?.bank_name || ""
        }
      });

      // Convertir string a Date para el calendario
      if (initialData.contact.date_of_birth) {
        setDateOfBirth(new Date(initialData.contact.date_of_birth));
      } else {
        setDateOfBirth(null);
      }
    } else if (visible) {
      // Resetear formulario cuando se abre para crear nuevo
      setFormData({
        type: "client",
        organization_type: "",
        municipality_id: "",
        liability_type: "",
        regime_type: "",
        contact: {
          name: "",
          document_type: "CC",
          document_number: "",
          dv: "",
          email: "",
          phone: "",
          address: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          second_last_name: "",
          date_of_birth: null
        }
      });
      setDateOfBirth(null);
    }
  }, [visible, initialData]);
  useEffect(() => {
    loadResources();
    loadBanks();
  }, []);
  async function loadResources() {
    const organizationTypes = await resourcesAdminService.getOrganizationTypes();
    const municipalities = await resourcesAdminService.getMunicipalities();
    const liabilityTypes = await resourcesAdminService.getLiabilityTypes();
    const regimeTypes = await resourcesAdminService.getRegimeTypes();
    setOrganizationTypes(organizationTypes);
    setMunicipalities(municipalities);
    setLiabilityTypes(liabilityTypes);
    setRegimeTypes(regimeTypes);
  }
  async function loadBanks() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer sk_test_mPfpVxOu0CbL4nc6FTOMrBv62fUle4Ve`
    };
    const url = new URL(`https://api.onepay.la/v1/banks`);
    const onepayBanks = await fetch(url.toString(), {
      method: "GET",
      headers
    });
    const response = await onepayBanks.json();
    setBanks(response);
  }
  const tipoTerceroOptions = [{
    label: "Cliente",
    value: "client"
  }, {
    label: "Proveedor",
    value: "provider"
  }, {
    label: "Entidad",
    value: "entity"
  }];
  const tipoDocumentoOptions = [{
    label: "Cédula",
    value: "CC"
  }, {
    label: "NIT",
    value: "NIT"
  }, {
    label: "Pasaporte",
    value: "PA"
  }, {
    label: "Extranjería",
    value: "CE"
  }, {
    label: "RNC",
    value: "RNC"
  }];
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    if (name.startsWith("contact.")) {
      const contactField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else if (name.startsWith("medicalPay.")) {
      const medicalPayField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        medicalPay: {
          ...prev.medicalPay,
          [medicalPayField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleDropdownChange = (e, field) => {
    if (field.startsWith("contact.")) {
      const contactField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: e.value
        }
      }));
    } else if (field.startsWith("medicalPay.")) {
      const medicalPayField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        medicalPay: {
          ...prev.medicalPay,
          [medicalPayField]: e.value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: e.value
      }));
    }
  };
  const handleDateChange = e => {
    if (e.value && !Array.isArray(e.value)) {
      const selectedDate = e.value;
      setDateOfBirth(selectedDate);

      // Formatear fecha a string ISO (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          date_of_birth: formattedDate
        }
      }));
    } else {
      setDateOfBirth(null);
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          date_of_birth: null
        }
      }));
    }
  };
  const handleSubmit = e => {
    e.preventDefault();

    // Validación básica
    if (!formData.contact.document_number) {
      return;
    }
    if (formData.medicalPay) {
      formData.medicalPay.bank_id = formData.medicalPay.bank.id;
      formData.medicalPay.bank_name = formData.medicalPay.bank.name;
    }
    if (initialData && onEdit) {
      onEdit(formData);
    } else {
      onSubmit(formData);
    }
  };
  const getFormattedTitle = () => {
    return initialData ? `Editar Tercero - ${initialData.contact.first_name}` : "Nuevo Tercero";
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: getFormattedTitle(),
    visible: visible,
    style: {
      width: "70vw"
    },
    onHide: onHide,
    maximizable: true,
    modal: true,
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, error && /*#__PURE__*/React.createElement(Message, {
    severity: "error",
    text: error,
    className: "mb-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "type",
    className: "form-label"
  }, "Tipo de Tercero *"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "type",
    value: formData.type,
    options: tipoTerceroOptions,
    onChange: e => handleDropdownChange(e, "type"),
    placeholder: "Seleccione tipo",
    className: "w-100",
    disabled: !!initialData
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.document_type",
    className: "form-label"
  }, "Tipo de Documento *"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "contact.document_type",
    value: formData.contact.document_type,
    options: tipoDocumentoOptions,
    onChange: e => handleDropdownChange(e, "contact.document_type"),
    placeholder: "Seleccione tipo",
    className: "w-100",
    disabled: !!initialData
  })), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: formData.contact.document_type === "NIT" ? "col-8 mb-3" : "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.document_number",
    className: "form-label"
  }, "N\xFAmero de Documento *"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.document_number",
    name: "contact.document_number",
    value: formData.contact.document_number,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese el n\xFAmero de documento",
    disabled: !!initialData,
    required: true
  })), formData.contact.document_type === "NIT" && /*#__PURE__*/React.createElement("div", {
    className: formData.contact.document_type === "NIT" ? "col-4 mb-3" : "d-none"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.dv",
    className: "form-label"
  }, "DV *"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.dv",
    name: "contact.dv",
    value: formData.contact.dv,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese el DV",
    disabled: !!initialData,
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.email",
    className: "form-label"
  }, "Correo Electr\xF3nico"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.email",
    name: "contact.email",
    value: formData.contact.email,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "ejemplo@dominio.com",
    type: "email"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.phone",
    className: "form-label"
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement(InputMask, {
    id: "contact.phone",
    name: "contact.phone",
    value: formData.contact.phone,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese n\xFAmero telef\xF3nico",
    mask: "999-999-9999"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.address",
    className: "form-label"
  }, "Direcci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.address",
    name: "contact.address",
    value: formData.contact.address,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese direcci\xF3n completa"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.name",
    className: "form-label"
  }, "Raz\xF3n social *"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.name",
    name: "contact.name",
    value: formData.contact.name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese la raz\xF3n social",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.first_name",
    className: "form-label"
  }, "Primer Nombre"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.first_name",
    name: "contact.first_name",
    value: formData.contact.first_name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese primer nombre"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.middle_name",
    className: "form-label"
  }, "Segundo Nombre"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.middle_name",
    name: "contact.middle_name",
    value: formData.contact.middle_name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese segundo nombre (si aplica)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.last_name",
    className: "form-label"
  }, "Primer Apellido"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.last_name",
    name: "contact.last_name",
    value: formData.contact.last_name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese primer apellido"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.second_last_name",
    className: "form-label"
  }, "Segundo Apellido"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.second_last_name",
    name: "contact.second_last_name",
    value: formData.contact.second_last_name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese segundo apellido (si aplica)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "date_of_birth",
    className: "form-label"
  }, "Fecha de Nacimiento"), /*#__PURE__*/React.createElement(Calendar, {
    id: "date_of_birth",
    value: dateOfBirth,
    onChange: handleDateChange,
    dateFormat: "dd/mm/yy",
    className: "w-100",
    showIcon: true,
    placeholder: "Seleccione fecha",
    maxDate: new Date(),
    yearRange: "1900:2030"
  })))), /*#__PURE__*/React.createElement("hr", {
    className: "my-4"
  }), /*#__PURE__*/React.createElement("h5", {
    className: "mb-3"
  }, "Informaci\xF3n Facturaci\xF3n Electr\xF3nica"), /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "organization_type",
    className: "form-label"
  }, "Tipo de Organizaci\xF3n"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "organization_type",
    value: formData.organization_type,
    options: organizationTypes,
    onChange: e => handleDropdownChange(e, "organization_type"),
    placeholder: "Seleccione tipo",
    className: "w-100",
    optionLabel: "name",
    optionValue: "id",
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "liability_type",
    className: "form-label"
  }, "Agente retenedor"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "liability_type",
    value: formData.liability_type,
    options: liabilityTypes,
    onChange: e => handleDropdownChange(e, "liability_type"),
    placeholder: "Seleccione tipo",
    className: "w-100",
    optionLabel: "name",
    optionValue: "id",
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "regime_type",
    className: "form-label"
  }, "Tipo de R\xE9gimen"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "regime_type",
    value: formData.regime_type,
    options: regimeTypes,
    onChange: e => handleDropdownChange(e, "regime_type"),
    placeholder: "Seleccione tipo",
    className: "w-100",
    optionLabel: "name",
    optionValue: "id",
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "municipality_id",
    className: "form-label"
  }, "Municipio/Ciudad"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "municipality_id",
    value: formData.municipality_id,
    options: municipalities,
    onChange: e => handleDropdownChange(e, "municipality_id"),
    placeholder: "Seleccione tipo",
    className: "w-100",
    virtualScrollerOptions: {
      itemSize: 38
    },
    filter: true,
    optionLabel: "name",
    optionValue: "id",
    required: true
  })))), /*#__PURE__*/React.createElement("hr", {
    className: "my-4"
  }), /*#__PURE__*/React.createElement("h5", {
    className: "mb-3"
  }, "Informaci\xF3n Medicalpay"), /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "account_number",
    className: "form-label"
  }, "N\xFAmero de Cuenta"), /*#__PURE__*/React.createElement(InputText, {
    id: "medicalPay.account_number",
    name: "medicalPay.account_number",
    value: formData?.medicalPay?.account_number,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese el n\xFAmero de cuenta",
    disabled: !!initialData,
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "subtype",
    className: "form-label"
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "subtype",
    value: formData.medicalPay?.subtype,
    options: [{
      id: "SAVINGS",
      name: "Ahorros"
    }, {
      id: "CHECKING",
      name: "Cuenta Corriente"
    }, {
      id: "ELECTRONIC_DEPOSIT",
      name: "Deposito Electronico"
    }, {
      id: "KEY(Bre-B)",
      name: "Llave Bre-B"
    }],
    onChange: e => handleDropdownChange(e, "medicalPay.subtype"),
    placeholder: "Seleccione tipo",
    className: "w-100",
    optionLabel: "name",
    optionValue: "id",
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "bank",
    className: "form-label"
  }, "Banco"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "regime_type",
    value: formData.medicalPay?.bank,
    options: banks,
    onChange: e => handleDropdownChange(e, "medicalPay.bank"),
    placeholder: "Seleccione tipo",
    className: "w-100",
    optionLabel: "name",
    required: true
  })))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "p-button-secondary me-3",
    style: {
      minWidth: "80px"
    },
    onClick: onHide,
    disabled: loading
  }, " ", /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times me-2"
  })), /*#__PURE__*/React.createElement(Button, {
    label: initialData ? "Actualizar" : "Guardar",
    className: "p-button-primary",
    type: "submit",
    style: {
      minWidth: "80px"
    },
    loading: loading
  }, " ", /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check me-2"
  })))));
};