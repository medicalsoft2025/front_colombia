import React from 'react';
import { Dialog } from 'primereact/dialog';
export const LoadDetailModal = props => {
  const {
    visible,
    onHide,
    load
  } = props;
  if (!load) return null;
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Detalle de la Carga",
    visible: visible,
    onHide: onHide,
    style: {
      width: '60vw'
    },
    breakpoints: {
      '960px': '85vw',
      '641px': '100vw'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Tipo de proceso"), /*#__PURE__*/React.createElement("span", null, load.processTypeId || '-')), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Motivo"), /*#__PURE__*/React.createElement("span", null, load.reasonId || '-')), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Fecha de esterilizaci\xF3n"), /*#__PURE__*/React.createElement("span", null, load.sterilizationDate)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Hora inicio"), /*#__PURE__*/React.createElement("span", null, load.startTime.toString())), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Duraci\xF3n (min)"), /*#__PURE__*/React.createElement("span", null, load.durationMinutes)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Hora fin"), /*#__PURE__*/React.createElement("span", null, load.endTime.toString())), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Temperatura (\xB0C)"), /*#__PURE__*/React.createElement("span", null, load.temperature)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Presi\xF3n (PSI)"), /*#__PURE__*/React.createElement("span", null, load.pressure)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Vigencia (d\xEDas)"), /*#__PURE__*/React.createElement("span", null, load.validityDays)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Fecha de vencimiento"), /*#__PURE__*/React.createElement("span", null, load.expirationDate.toString())), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Responsable"), /*#__PURE__*/React.createElement("span", null, load.responsibleName || '-')), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Control qu\xEDmico"), /*#__PURE__*/React.createElement("span", null, load.chemicalControl ? 'Sí' : 'No')), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Control biol\xF3gico"), /*#__PURE__*/React.createElement("span", null, load.biologicalControl ? 'Sí' : 'No')), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-muted small"
  }, "Observaciones"), /*#__PURE__*/React.createElement("span", null, load.observations || 'N/A'))));
};