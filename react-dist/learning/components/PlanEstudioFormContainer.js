import React from 'react';
import { useLocalStorageContext } from "../context/LocalStorageContext.js";
import { PlanEstudioForm } from "./PlanEstudioForm.js";
export const PlanEstudioFormContainer = () => {
  const formId = "planEstudioForm";
  const {
    selectedItem,
    loadingItem,
    saveItem,
    closeDialog
  } = useLocalStorageContext();
  const onSubmit = data => {
    saveItem(data);
    closeDialog();
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PlanEstudioForm, {
    formId: formId,
    onSubmit: onSubmit,
    initialData: selectedItem,
    loadingItem: loadingItem
  }), /*#__PURE__*/React.createElement("button", {
    form: formId,
    type: "submit",
    className: "btn btn-primary mt-3"
  }, "Guardar"));
};