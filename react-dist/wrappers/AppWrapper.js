import React from "react";
import { PersistentQueryProvider } from "./PersistentQueryProvider.js";
export const AppWrapper = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PersistentQueryProvider, null, children));
};