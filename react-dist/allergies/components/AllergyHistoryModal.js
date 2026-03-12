import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAllergies } from "../hooks/useAllergies.js";
import { allergyStatusMap } from "../consts/index.js";
export const AllergyHistoryModal = props => {
  const {
    visible,
    onHide,
    allergyId,
    patientId
  } = props;
  const {
    getAllergyHistory
  } = useAllergies(patientId);
  const {
    data: history,
    isLoading
  } = getAllergyHistory(allergyId);
  const statusTemplate = status => {
    return allergyStatusMap[status] || status;
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Historial de Alergia",
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
    body: rowData => rowData.changedAt ? new Date(rowData.changedAt).toLocaleString() : '',
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "previousStatus",
    header: "Estado Anterior",
    body: rowData => statusTemplate(rowData.previousStatus)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "newStatus",
    header: "Nuevo Estado",
    body: rowData => statusTemplate(rowData.newStatus)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "changedBy",
    header: "Usuario"
  })));
};