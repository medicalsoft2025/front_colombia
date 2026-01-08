import React from "react";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm.js";
import { tableFilters } from "../config/table-filters.js";
export const PatientEvolutions = () => {
  const handleFiltersChange = data => {
    console.log(data);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DynamicForm, {
    config: tableFilters,
    onSubmit: () => {},
    onChange: handleFiltersChange
  }));
};