import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useLocalStorageContext } from "../context/LocalStorageContext.js";
import { Toast } from 'primereact/toast';
import { PlanEstudioFormContainer } from "./PlanEstudioFormContainer.js";
import { PlanEstudioTableContainer } from "./PlanEstudioTableContainer.js";
export const PlanEstudio = () => {
  const {
    dialogVisible,
    openDialogCreate,
    closeDialog,
    toast
  } = useLocalStorageContext();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Item",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-1"
    }),
    onClick: openDialogCreate
  })), /*#__PURE__*/React.createElement(PlanEstudioTableContainer, null), /*#__PURE__*/React.createElement(Dialog, {
    visible: dialogVisible,
    onHide: closeDialog,
    header: "Agregar Item",
    style: {
      width: '50vw'
    }
  }, /*#__PURE__*/React.createElement(PlanEstudioFormContainer, null)));
};