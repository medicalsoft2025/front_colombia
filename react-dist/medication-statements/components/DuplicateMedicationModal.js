import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { MEDICATION_STATEMENT_STATUS_OPTIONS } from "../consts/status.js";
export const DuplicateMedicationModal = ({
  visible,
  onHide,
  activeMedications,
  onUpdateStatusAndContinue,
  onContinueAsNew
}) => {
  const [selectedStatus, setSelectedStatus] = useState({});
  const handleStatusChange = (id, status) => {
    setSelectedStatus(prev => ({
      ...prev,
      [id]: status
    }));
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Medicamento ya activo",
    visible: visible,
    style: {
      width: '50vw'
    },
    onHide: onHide,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between w-100"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      severity: "danger",
      onClick: onHide
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Continuar como medicamento nuevo",
      severity: "secondary",
      onClick: onContinueAsNew
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("p", null, "El paciente ya tiene los siguientes registros activos para este medicamento. \xBFDesea actualizar el estado de alguno antes de continuar?"), /*#__PURE__*/React.createElement("div", {
    className: "list-group"
  }, activeMedications.map(med => /*#__PURE__*/React.createElement("div", {
    key: med.id,
    className: "list-group-item d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h6", {
    className: "mb-0"
  }, med.medicationName), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, med.dosage || 'Sin dosis especificada')), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center",
    style: {
      width: '300px'
    }
  }, /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedStatus[med.id] || med.status,
    options: MEDICATION_STATEMENT_STATUS_OPTIONS,
    onChange: e => handleStatusChange(med.id, e.value),
    placeholder: "Estado",
    className: "flex-grow-1"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Actualizar estado y continuar",
    onClick: () => onUpdateStatusAndContinue(med.id, selectedStatus[med.id] || med.status)
  })))))));
};