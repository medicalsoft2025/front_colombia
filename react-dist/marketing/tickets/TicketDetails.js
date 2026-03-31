import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TaskDetails } from "./TaskDetails.js";
import { taskStatusMap, taskColorMap, formatDate } from "./utils/ticketUtils.js";
export const TicketDetails = ({
  visible,
  ticket,
  onHide
}) => {
  const [isTaskDetailsVisible, setIsTaskDetailsVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  if (!ticket) {
    return null;
  }
  const getStatusText = status => {
    const statusMap = {
      open: "Abierto",
      new: "Abierto",
      closed: "Cerrado",
      in_progress: "En Proceso",
      pending: "Pendiente"
    };
    return statusMap[status] || status;
  };
  const getStatusClass = status => {
    const statusClassMap = {
      open: "bg-info",
      new: "bg-info",
      closed: "bg-secondary",
      in_progress: "bg-warning",
      pending: "bg-warning"
    };
    return statusClassMap[status] || "bg-info";
  };
  const truncateText = (text, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Button, {
      className: "p-button-primary p-button-rounded",
      onClick: () => {
        setSelectedTask(rowData);
        setIsTaskDetailsVisible(true);
      },
      tooltip: "Ver detalles de la tarea",
      tooltipOptions: {
        position: "top"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-eye"
    }));
  };
  const statusBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${taskColorMap[rowData.status_title]} p-2 text-white`,
      style: {
        fontSize: "0.875rem",
        borderRadius: "4px",
        textTransform: "none"
      }
    }, taskStatusMap[rowData.status_title]);
  };
  const titleBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "text-900 font-medium",
      title: rowData.title,
      style: {
        cursor: "help"
      }
    }, truncateText(rowData.title, 40));
  };
  const assignedBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-user mx-2 text-primary",
      style: {
        fontSize: "0.875rem"
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-600",
      style: {
        textTransform: "none"
      }
    }, rowData.assigned_to_user || "Sin asignar"));
  };
  const idBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "text-600 font-mono text-sm"
    }, "#", rowData.id);
  };
  const renderTasksSection = () => {
    const tasks = ticket.tasks || [];
    return /*#__PURE__*/React.createElement("div", {
      className: "mt-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-between mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "block text-600 font-bold"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-tasks mx-2 text-primary"
    }), "Tareas del Ticket")), tasks.length > 0 ? /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: tasks,
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 25],
      className: "p-datatable-sm",
      showGridlines: true,
      stripedRows: true,
      responsiveLayout: "scroll",
      emptyMessage: "No hay tareas para mostrar",
      size: "small",
      sortField: "id",
      sortOrder: -1
    }, /*#__PURE__*/React.createElement(Column, {
      field: "id",
      header: "ID",
      sortable: true,
      style: {
        width: "10%"
      },
      body: idBodyTemplate
    }), /*#__PURE__*/React.createElement(Column, {
      field: "title",
      header: "T\xEDtulo",
      sortable: true,
      style: {
        width: "35%"
      },
      body: titleBodyTemplate
    }), /*#__PURE__*/React.createElement(Column, {
      field: "assigned_to_user",
      header: "Asignado a",
      sortable: true,
      style: {
        width: "20%"
      },
      body: assignedBodyTemplate
    }), /*#__PURE__*/React.createElement(Column, {
      field: "status_title",
      header: "Estado",
      sortable: true,
      style: {
        width: "20%"
      },
      body: statusBodyTemplate
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Acciones",
      body: actionBodyTemplate,
      style: {
        width: "15%",
        textAlign: "center"
      }
    }))) : /*#__PURE__*/React.createElement("div", {
      className: "text-500 text-sm p-3 surface-100 border-round flex align-items-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mb-0"
    }, "Este ticket no tiene tareas asociadas.")));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, {
    header: "Detalles del Ticket",
    visible: visible,
    style: {
      width: "85vw"
    },
    onHide: onHide,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-end gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cerrar",
      icon: "fas fa-times",
      onClick: onHide,
      className: "p-button-outlined"
    })),
    draggable: false,
    resizable: false,
    className: "ticket-details-dialog"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      marginBottom: "1.5rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-tag mx-2 text-primary"
  }), "Ticket #", ticket.id), /*#__PURE__*/React.createElement("div", {
    className: "text-900 surface-100 border-round"
  }, /*#__PURE__*/React.createElement("span", {
    className: `badge ${getStatusClass(ticket.status)} p-2`
  }, getStatusText(ticket.status)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-comment mx-2 text-primary"
  }), "Asunto"), /*#__PURE__*/React.createElement("div", {
    className: "text-900 surface-100 border-round p-2"
  }, ticket.title)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-user mx-2 text-primary"
  }), "Asignado a"), /*#__PURE__*/React.createElement("div", {
    className: "text-900 surface-100 border-round p-2"
  }, ticket.assigned_to_user || "Sin asignar")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-calendar-alt mx-2 text-primary"
  }), "Fecha de Creaci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "text-900 surface-100 border-round p-2"
  }, formatDate(ticket.created_at)))), /*#__PURE__*/React.createElement(Divider, null), renderTasksSection())), /*#__PURE__*/React.createElement(TaskDetails, {
    visible: isTaskDetailsVisible,
    task: selectedTask,
    onHide: () => {
      setIsTaskDetailsVisible(false);
      setSelectedTask(null);
    }
  }));
};