import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useLoads } from "../../hooks/useLoads.js";
export const LoadHistoryModal = props => {
  const {
    visible,
    onHide,
    loadId
  } = props;
  const {
    getLoadHistory
  } = useLoads();
  const {
    data: history,
    isLoading
  } = getLoadHistory(loadId);
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Historial de Estados",
    visible: visible,
    onHide: onHide,
    style: {
      width: '50vw'
    },
    breakpoints: {
      '960px': '75vw',
      '641px': '100vw'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: history || [],
    loading: isLoading,
    showGridlines: true,
    size: "small",
    emptyMessage: "No hay historial registrado."
  }, /*#__PURE__*/React.createElement(Column, {
    field: "changedAt",
    header: "Fecha de Cambio",
    body: rowData => new Date(rowData.changedAt).toLocaleString()
  }), /*#__PURE__*/React.createElement(Column, {
    field: "previousStatus",
    header: "Estado Anterior"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "newStatus",
    header: "Nuevo Estado"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "changedBy",
    header: "Usuario"
  })));
};