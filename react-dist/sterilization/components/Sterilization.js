import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { PackagesTab } from "./packages/PackagesTab.js";
import { LoadsTab } from "./loads/LoadsTab.js";
export const Sterilization = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "card m-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(TabView, null, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Cargas"
  }, /*#__PURE__*/React.createElement(LoadsTab, null)), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Paquetes"
  }, /*#__PURE__*/React.createElement(PackagesTab, null)))));
};