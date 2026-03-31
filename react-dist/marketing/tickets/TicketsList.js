import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ticketStatusMap, ticketColorMap } from "./utils/ticketUtils.js";
export const TicketsList = ({
  tickets,
  loading,
  error,
  onNewTicket,
  onViewTicket
}) => {
  const statusBodyTemplate = rowData => {
    const statusText = ticketStatusMap[rowData.status] || rowData.status;
    const colorClass = ticketColorMap[rowData.status] || "bg-light text-dark";
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${colorClass}`
    }, statusText);
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Button, {
      className: "p-button-primary p-button-rounded flex align-items-center justify-content-center",
      "aria-label": "Ver",
      onClick: () => onViewTicket(rowData),
      tooltip: "Ver detalles del ticket",
      tooltipOptions: {
        position: "top"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-search"
    }));
  };
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "card p-3 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem"
      }
    }, /*#__PURE__*/React.createElement("h3", null, "Listado de Tickets"), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-info d-flex gap-2 ",
      "aria-label": "Crear Ticket",
      onClick: onNewTicket
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus"
    }), " Crear Ticket")), /*#__PURE__*/React.createElement("div", {
      className: "text-info mb-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-exclamation-circle fa-2x"
    }), /*#__PURE__*/React.createElement("p", {
      className: "mt-2"
    }, "No hay tickets para mostrar")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "card p-3"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem"
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Listado de Tickets"), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-info d-flex gap-2 ",
    "aria-label": "Crear Ticket",
    onClick: onNewTicket
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Crear Ticket")), /*#__PURE__*/React.createElement(DataTable, {
    value: tickets,
    paginator: true,
    rows: 10,
    emptyMessage: "No hay tickets encontrados.",
    loading: loading
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "ID",
    sortable: true,
    style: {
      width: "10%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "title",
    header: "Asunto",
    sortable: true,
    style: {
      width: "30%",
      textTransform: "uppercase"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "assigned_to_user",
    header: "Asignado a",
    sortable: true,
    style: {
      width: "20%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "created_at",
    header: "Fecha Creaci\xF3n",
    sortable: true,
    style: {
      width: "20%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "status",
    header: "Estado",
    body: statusBodyTemplate,
    sortable: true,
    style: {
      width: "10%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    exportable: false,
    style: {
      width: "10%",
      textAlign: "center"
    },
    header: "Acciones"
  })));
};