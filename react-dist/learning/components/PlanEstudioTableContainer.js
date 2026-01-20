import React from 'react';
import { PlanEstudioTable } from "./PlanEstudioTable.js";
import { useLocalStorageContext } from "../context/LocalStorageContext.js";
export const PlanEstudioTableContainer = () => {
  const {
    items,
    loadingItems,
    getItems,
    removeItem,
    openDialogEdit
  } = useLocalStorageContext();
  return /*#__PURE__*/React.createElement(PlanEstudioTable, {
    items: items,
    loadingItems: loadingItems,
    onReload: getItems,
    removeItem: removeItem,
    editItem: openDialogEdit
  });
};