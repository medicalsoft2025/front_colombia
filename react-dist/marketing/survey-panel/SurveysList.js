function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from "react";
import { surveyService, inventoryService, specialtiesService, clinicalRecordTypeService } from "../../../services/api/index.js";
import { useDataPagination } from "../../hooks/useDataPagination.js";
import { PrimeReactProvider } from "primereact/api";
import { Card } from "primereact/card";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu.js";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
export const SurveysList = () => {
  const [configureModal, setConfigureModal] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [services, setServices] = useState([]);
  const [clinicalRecordTypes, setClinicalRecordTypes] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      post_consultation_hours: null,
      attempts: null,
      service: null,
      specialty: null,
      clinical_record_type: null
    }
  });
  const {
    data: surveyData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: params => loadSurveys(params),
    defaultPerPage: 10
  });
  async function loadSurveys(params = {
    perPage: 10
  }) {
    const backendFilters = {
      ...params
    };
    if (params.search && params.search.trim() !== "") {
      backendFilters.search = params.search.trim();
    }
    const data = await surveyService.getAllFilter(backendFilters);
    return {
      data: data.data.data,
      total: data.data.total || 0
    };
  }
  async function loadResources() {
    const specialties = await specialtiesService.getAll();
    const services = await inventoryService.getServices();
    const clinicalRecordTypes = await clinicalRecordTypeService.getAll();
    setSpecialties(specialties);
    setServices(services);
    setClinicalRecordTypes(clinicalRecordTypes);
  }
  const accionesBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(CustomPRTableMenu, {
      rowData: rowData,
      menuItems: getMenuItems(rowData)
    }));
  };
  function handleConfigure(row) {
    setSelectedSurvey(row);
    setConfigureModal(true);
  }
  const handleSave = async data => {
    console.log(data);
    const payload = {
      survey_id: selectedSurvey?.id,
      post_consultation_hours: formattedDate(data.post_consultation_hours),
      attempts: data.attempts,
      specialty_id: data.specialty || null,
      clinical_record_type_id: data.clinical_record_type,
      service_id: data?.service?.toString() || null
    };
    console.log(payload);
    await surveyService.saveConfigurationSurvey(payload);
    setConfigureModal(false);
  };
  function formattedDate(date) {
    const horas = addZero(date.getHours());
    const minutos = addZero(date.getMinutes());
    const segundos = addZero(date.getSeconds());
    return `${horas}:${minutos}:${segundos}`;
  }
  function addZero(number) {
    return number < 10 ? "0" + number : number;
  }
  const getMenuItems = rowData => [
  // {
  //   label: "Editar",
  //   icon: <i className="fas fa-edit me-2"></i>,
  //   command: () => handleEditDocument(rowData.id),
  //   visible: !rowData.firmado,
  // },
  {
    label: "Ver",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-eye me-2"
    })
  }, {
    label: "Reenviar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-paper-plane me-2"
    })
  }, {
    label: "Configurar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cog me-2"
    }),
    command: () => handleConfigure(rowData)
  }, {
    label: "Eliminar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash me-2"
    })
  }];
  const columns = [{
    field: "id",
    header: "ID"
  }, {
    field: "title",
    header: "Titulo"
  }, {
    field: "description",
    header: "Descripcion"
  }, {
    field: "createdAt",
    header: "Fecha de creacion",
    body: rowData => `${new Date(rowData.created_at).toLocaleDateString()}`.slice(0, 10)
  }, {
    field: "actions",
    header: "Acciones",
    body: accionesBodyTemplate,
    exportable: false,
    style: {
      minWidth: "80px",
      textAlign: "center"
    },
    width: "80px"
  }];
  useEffect(() => {
    loadResources();
  }, []);
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: surveyData,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingPaginator,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: () => refresh()
  })), /*#__PURE__*/React.createElement(Dialog, {
    visible: configureModal,
    onHide: () => setConfigureModal(false),
    header: "Configuraci\xF3n de env\xEDo",
    style: {
      width: "70vw"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm p-0"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(handleSave),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "post_consultation_hours"
  }, "Despues de cuanto tiempo quiere que se envie"), /*#__PURE__*/React.createElement(Controller, {
    name: "post_consultation_hours",
    control: control,
    rules: {
      required: true
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      className: "w-100",
      timeOnly: true,
      showIcon: true
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "attempts"
  }, "Reintentos"), /*#__PURE__*/React.createElement(Controller, {
    name: "attempts",
    control: control,
    rules: {
      required: true
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      useGrouping: false,
      className: "w-100"
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "clinical_record_type"
  }, "Vincular Tipo de historia clinica *"), /*#__PURE__*/React.createElement(Controller, {
    name: "clinical_record_type",
    control: control,
    rules: {
      required: true
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: clinicalRecordTypes,
      optionLabel: "name",
      optionValue: "id",
      className: "w-100",
      filter: true
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "specialty"
  }, "Vincular especialidades"), /*#__PURE__*/React.createElement(Controller, {
    name: "specialty",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: specialties,
      optionLabel: "name",
      optionValue: "id",
      className: "w-100",
      filter: true
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "service"
  }, "Vincular servicio prestado"), /*#__PURE__*/React.createElement(Controller, {
    name: "service",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: services,
      optionLabel: "name",
      optionValue: "id",
      className: "w-100",
      filter: true
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-end"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    className: "px-4" // Reduce el padding horizontal
    ,
    style: {
      minWidth: "100px"
    } // Ancho mínimo personalizado
  })))))))));
};