import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useInventoryMovementReport } from "../hooks/useInventoryMovementReport.js";
export const InventoryMovementReport = () => {
  // Hook para obtener los datos del reporte
  const {
    reportData,
    loading,
    dateRange,
    setDateRange
    // Los filtros se agregarán después
  } = useInventoryMovementReport();
  const [expandedRows, setExpandedRows] = useState(null);
  const [totalMovements, setTotalMovements] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  useEffect(() => {
    calcularTotales(reportData);
  }, [reportData]);
  const calcularTotales = datos => {
    let totalMov = 0;
    let totalDep = datos.length;
    datos.forEach(deposit => {
      totalMov += deposit.total_movements || 0;
    });
    setTotalMovements(totalMov);
    setTotalDeposits(totalDep);
  };

  // Formatear fecha
  const formatDate = dateString => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  // Template para expandir/contraer filas (mostrar movimientos del depósito)
  const rowExpansionTemplate = deposit => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, "Movimientos del Dep\xF3sito: ", deposit.deposit_name), /*#__PURE__*/React.createElement(DataTable, {
      value: deposit.movements,
      size: "small",
      responsiveLayout: "scroll",
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20],
      emptyMessage: "No hay movimientos para este dep\xF3sito"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "movement_date",
      header: "Fecha Movimiento",
      body: rowData => formatDate(rowData.movement_date),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "type",
      header: "Tipo",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: `badge ${rowData.type === "entry" ? "bg-success" : "bg-warning"}`
      }, rowData.type === "entry" ? "ENTRADA" : "SALIDA"),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "quantity",
      header: "Cantidad",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: `fw-bold ${rowData.type === "entry" ? "text-success" : "text-danger"}`
      }, rowData.type === "entry" ? "+" : "-", rowData.quantity),
      style: {
        textAlign: "right"
      },
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Lote",
      body: rowData => rowData.lot ? /*#__PURE__*/React.createElement("div", null, rowData.lot.lot_number) : "N/A"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Factura",
      body: rowData => rowData.invoice ? /*#__PURE__*/React.createElement("div", null, rowData.invoice.invoice_code) : "N/A"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Usuario",
      body: rowData => rowData.user ? /*#__PURE__*/React.createElement("div", null, rowData.user.full_name) : "N/A"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Dep\xF3sito Relacionado",
      body: rowData => rowData.related_deposit ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "fw-bold"
      }, rowData.related_deposit.name), /*#__PURE__*/React.createElement("small", {
        className: "text-muted"
      }, rowData.related_deposit.type)) : "N/A"
    })));
  };

  // Template para el tipo de depósito
  const depositTypeTemplate = rowData => {
    let badgeClass = "bg-secondary";
    let typeText = rowData.deposit_type;
    if (rowData.deposit_type === "PHARMACY") {
      badgeClass = "bg-info";
      typeText = "Farmacia";
    } else if (rowData.deposit_type === "WAREHOUSE") {
      badgeClass = "bg-warning";
      typeText = "Bodega";
    } else if (rowData.deposit_type === "CLINIC") {
      badgeClass = "bg-primary";
      typeText = "Clínica";
    }
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${badgeClass}`
    }, typeText);
  };

  // Template para estado del depósito
  const statusTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.is_active ? "bg-success" : "bg-danger"}`
    }, rowData.is_active ? "Activo" : "Inactivo");
  };

  // Footer para los totales
  const footerTotales = /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Dep\xF3sitos:"), " ", totalDeposits), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Movimientos:"), " ", totalMovements), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("strong", null, "\xDAltima actualizaci\xF3n:"), " ", new Date().toLocaleDateString("es-ES")));
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Reporte de Movimientos de Inventario")), /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: reportData,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron dep\xF3sitos con movimientos",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    footer: footerTotales,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "deposit_id"
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: "3em"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "deposit_id",
    header: "ID Dep\xF3sito",
    sortable: true,
    style: {
      width: "100px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "deposit_name",
    header: "Nombre Dep\xF3sito",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "deposit_type",
    header: "Tipo",
    body: depositTypeTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "is_active",
    header: "Estado",
    body: statusTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total_movements",
    header: "N\xB0 Movimientos",
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.total_movements > 0 ? "bg-primary" : "bg-secondary"}`
    }, rowData.total_movements),
    style: {
      textAlign: "center",
      width: "120px"
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    header: "\xDAltimo Movimiento",
    body: rowData => {
      if (!rowData.movements || rowData.movements.length === 0) {
        return "Sin movimientos";
      }
      const lastMovement = rowData.movements[0]; // Ya están ordenados por fecha descendente
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "small"
      }, formatDate(lastMovement.movement_date)), /*#__PURE__*/React.createElement("div", {
        className: `small ${lastMovement.type === "entry" ? "text-success" : "text-danger"}`
      }, lastMovement.type === "entry" ? "Entrada" : "Salida", ": ", lastMovement.quantity));
    },
    style: {
      width: "150px"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-muted"
  }, "Dep\xF3sitos Activos"), /*#__PURE__*/React.createElement("h3", {
    className: "text-success"
  }, reportData.filter(d => d.is_active).length)))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-muted"
  }, "Total Entradas"), /*#__PURE__*/React.createElement("h3", {
    className: "text-success"
  }, reportData.reduce((acc, deposit) => {
    const entries = deposit.movements?.filter(m => m.type === "entry").length || 0;
    return acc + entries;
  }, 0))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-muted"
  }, "Total Salidas"), /*#__PURE__*/React.createElement("h3", {
    className: "text-danger"
  }, reportData.reduce((acc, deposit) => {
    const exits = deposit.movements?.filter(m => m.type === "exit" || m.type === "out").length || 0;
    return acc + exits;
  }, 0))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-muted"
  }, "Total Cantidad Movida"), /*#__PURE__*/React.createElement("h3", {
    className: "text-primary"
  }, reportData.reduce((acc, deposit) => {
    const totalQty = deposit.movements?.reduce((sum, m) => {
      return sum + (m.quantity || 0);
    }, 0) || 0;
    return acc + totalQty;
  }, 0)))))));
};