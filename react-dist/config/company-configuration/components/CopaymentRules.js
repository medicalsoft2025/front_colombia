import React from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { CopaymentRulesForm } from "../../copayment-rules/CopaymentRulesForm.js";
import { CopaymentRulesTable } from "../../copayment-rules/CopaymentRulesTable.js";
import { Dialog } from "primereact/dialog";
import { copaymentRulesService } from "../../../../services/api/index.js";
export const CopaymentRules = ({
  companyId = null
}) => {
  const toast = React.useRef(null);
  const [showForm, setShowForm] = React.useState(false);
  const [refreshTable, setRefreshTable] = React.useState(false);
  const handleFormToggle = () => {
    setShowForm(prev => !prev);
    setRefreshTable(false);
  };
  const handleOnSave = async data => {
    try {
      const response = await copaymentRulesService.create(data);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Regla de copago creada correctamente",
        life: 3000
      });
      setShowForm(prev => !prev);
      setRefreshTable(true);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000
      });
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h4", null, "Copagos"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo",
    tooltipOptions: {
      position: "top"
    },
    onClick: () => handleFormToggle(),
    className: "p-button-info "
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus ms-2"
  }, " ")))), /*#__PURE__*/React.createElement(CopaymentRulesTable, {
    refreshData: refreshTable
  })), /*#__PURE__*/React.createElement(Dialog, {
    visible: showForm,
    onHide: handleFormToggle,
    header: "Nueva regla de copago",
    style: {
      width: "70vw"
    }
  }, /*#__PURE__*/React.createElement(CopaymentRulesForm, {
    companyId: companyId,
    onSave: handleOnSave
  })), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};