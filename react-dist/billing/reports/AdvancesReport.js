import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { ThirdPartyDropdown } from "../../fields/dropdowns/ThirdPartyDropdown.js";
import { formatDateRange, formatPrice } from "../../../services/utilidades.js";
import { useAdvancesReportFormat } from "../../documents-generation/hooks/useAdvancesReportFormat.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { useDataPagination } from "../../hooks/useDataPagination.js";
import { BillingReportService } from "../../../services/api/classes/billingReportService.js";
import { Toast } from "primereact/toast";
export const AdvancesReport = () => {
  const toast = useRef(null);
  const [reportType, setReportType] = useState("client");
  const {
    generarFormatoAdvancesReport
  } = useAdvancesReportFormat();
  const [filtros, setFiltros] = useState({
    dateRange: [new Date(), new Date()],
    thirdPartyId: null
  });
  const {
    data: advancesReport,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: params => loadAdvancesReport(params),
    defaultPerPage: 10
  });
  async function loadAdvancesReport(params = {
    perPage: 10
  }) {
    const service = new BillingReportService();
    const backendFilters = {
      ...params,
      sort: "-id"
    };
    if (filtros.dateRange && Array.isArray(filtros.dateRange)) {
      const fechaArray = filtros.dateRange;
      if (fechaArray.length >= 2) {
        const startDate = fechaArray[0];
        const endDate = fechaArray[1];
        if (startDate && typeof startDate.toISOString === "function") {
          backendFilters.start_date = startDate.toISOString().split("T")[0];
        }
        if (endDate && typeof endDate.toISOString === "function") {
          backendFilters.end_date = endDate.toISOString().split("T")[0];
        }
      }
    }
    if (filtros.thirdPartyId) {
      backendFilters.third_party_id = filtros.thirdPartyId;
    }
    if (params.search && params.search.trim() !== "") {
      backendFilters.search = params.search.trim();
    }
    const response = await service.getAdvancesReportByType(backendFilters, {
      type: reportType
    });
    return {
      data: response.data.data || response.data || [],
      total: response.data.total || response.data.length || 0
    };
  }
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const limpiarFiltros = () => {
    setFiltros({
      dateRange: [new Date(), new Date()],
      thirdPartyId: null
    });
  };
  useEffect(() => {
    refresh();
  }, [reportType]);
  useEffect(() => {
    if (filtros.dateRange?.[0] === null && filtros.dateRange?.[1] === null && filtros.thirdPartyId === null) {
      refresh();
    }
  }, [filtros]);
  const formatMovementType = type => {
    return type === "income" ? "Ingreso" : "Egreso";
  };
  const getTypeBadgeClass = type => {
    return type === "income" ? "bg-success" : "bg-danger";
  };
  const formatMovementStatus = status => {
    const statusMap = {
      pending: "Pendiente",
      approved: "Aprobado",
      applied: "Aplicado",
      cancelled: "Cancelado"
    };
    return statusMap[status] || status;
  };
  const getStatusBadgeClass = status => {
    const statusClasses = {
      pending: "bg-warning",
      approved: "bg-success",
      applied: "bg-info",
      cancelled: "bg-danger"
    };
    return statusClasses[status] || "bg-secondary";
  };

  // Columnas para la tabla principal
  const mainColumns = [{
    field: "third_party.name",
    header: "Nombre",
    body: rowData => rowData.third_party?.name || "Sin nombre"
  }, {
    field: "third_party.document_number",
    header: "Documento",
    body: rowData => rowData.third_party?.document_number || "Sin documento"
  }, {
    field: "third_party.email",
    header: "Email",
    body: rowData => rowData.third_party?.email || "Sin email"
  }, {
    field: "amount",
    header: "Monto",
    body: rowData => formatPrice(rowData.amount),
    style: {
      textAlign: "right"
    }
  }, {
    field: "currency",
    header: "Moneda"
  }, {
    field: "type",
    header: "Tipo",
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `badge ${getTypeBadgeClass(rowData.type)}`
    }, formatMovementType(rowData.type))
  }, {
    field: "status",
    header: "Estado",
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `badge ${getStatusBadgeClass(rowData.status)}`
    }, formatMovementStatus(rowData.status))
  }, {
    field: "reference",
    header: "Referencia"
  }, {
    field: "created_at",
    header: "Fecha Creación",
    body: rowData => new Date(rowData.created_at).toLocaleDateString()
  }];
  const exportToPdf = () => {
    generarFormatoAdvancesReport(advancesReport, formatDateRange(filtros.dateRange), "Impresion");
  };
  const handleReload = () => {
    refresh();
  };
  const handleTypeChange = type => {
    setReportType(type);
  };
  const renderTypeSelector = () => /*#__PURE__*/React.createElement("div", {
    className: "row g-3 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de Reporte"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Anticipos de Clientes",
    icon: "pi pi-users",
    className: reportType === "client" ? "p-button-primary" : "p-button-outlined",
    onClick: () => handleTypeChange("client")
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Anticipos de Proveedores",
    icon: "pi pi-building",
    className: reportType === "provider" ? "p-button-primary" : "p-button-outlined",
    onClick: () => handleTypeChange("provider")
  }))));
  const renderFiltersAccordion = () => /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros - Reporte de Anticipos", " ", reportType === "client" ? "Clientes" : "Proveedores")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dateRange",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "dateRange",
    selectionMode: "range",
    value: filtros.dateRange,
    onChange: e => handleFilterChange("dateRange", e.value),
    className: "w-100",
    showIcon: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(ThirdPartyDropdown, {
    value: filtros.thirdPartyId,
    handleChange: e => handleFilterChange("thirdPartyId", e.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar Filtros",
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: handleReload,
    loading: loadingPaginator
  }))));
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "row g-3 justify-content-between align-items-start mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-professional-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: "tab-item active"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-hand-holding-usd"
  }), "Reporte de Anticipos -", " ", reportType === "client" ? "Clientes" : "Proveedores")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab-panel active"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mb-3"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-pdf me-2"
    }),
    label: "Exportar a PDF",
    className: "p-button-primary",
    onClick: exportToPdf
  })), renderTypeSelector(), renderFiltersAccordion(), /*#__PURE__*/React.createElement(Card, {
    title: `Reporte de Anticipos - ${reportType === "client" ? "Clientes" : "Proveedores"}`,
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: mainColumns,
    data: advancesReport,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingPaginator,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: () => refresh()
  }))))))))));
};