import React from 'react';
import { Dialog } from 'primereact/dialog';
import { PackageTable } from "../packages/PackageTable.js";
export const LoadPackagesModal = props => {
  const {
    visible,
    onHide,
    packages
  } = props;
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Paquetes vinculados a la carga",
    visible: visible,
    onHide: onHide,
    style: {
      width: '60vw'
    },
    breakpoints: {
      '960px': '85vw',
      '641px': '100vw'
    }
  }, /*#__PURE__*/React.createElement(PackageTable, {
    data: packages,
    loading: false,
    readOnly: true
  }));
};