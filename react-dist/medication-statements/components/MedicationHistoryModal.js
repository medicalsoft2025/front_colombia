import React from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useMedicationHistory } from "../hooks/useMedicationStatements.js";
import { MEDICATION_STATEMENT_STATUS_LABELS } from "../consts/status.js";
export const MedicationHistoryModal = ({
  visible,
  onHide,
  medicationStatementId,
  medicationName
}) => {
  const {
    data: history,
    isLoading
  } = useMedicationHistory(medicationStatementId);
  const statusTemplate = status => {
    if (!status) return "Inicial";
    return MEDICATION_STATEMENT_STATUS_LABELS[status] || status;
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: `Historial de Cambios: ${medicationName}`,
    visible: visible,
    style: {
      width: '600px'
    },
    onHide: onHide
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: history,
    loading: isLoading,
    emptyMessage: "No hay historial para este medicamento.",
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "previousStatus",
    header: "Estado Anterior",
    body: row => statusTemplate(row.previousStatus)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "newStatus",
    header: "Nuevo Estado",
    body: row => statusTemplate(row.newStatus)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "changedBy",
    header: "Por"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "changedAt",
    header: "Fecha"
  })));
};