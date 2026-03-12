import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useFamilyMemberHistory } from "../hooks/useFamilyMemberHistory.js";
import { familyMemberHistoryStatusMap } from "../consts/index.js";
export const FamilyMemberHistoryHistoryModal = props => {
  const {
    visible,
    onHide,
    recordId,
    patientId
  } = props;
  const {
    getChangeHistory
  } = useFamilyMemberHistory(patientId);
  const {
    data: history,
    isLoading
  } = getChangeHistory(recordId);
  const statusTemplate = status => {
    return familyMemberHistoryStatusMap[status] || status;
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Historial de Antecedente Familiar",
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