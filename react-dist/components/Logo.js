import React from "react";
import { getUserCountryUrlPrefix } from "../../services/utilidades.js";
export const Logo = () => {
  return /*#__PURE__*/React.createElement("a", {
    className: "navbar-brand me-1 me-sm-3",
    href: `${getUserCountryUrlPrefix()}/Dashboard`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center",
    id: ""
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/img/logos/FullColor.svg",
    alt: "phoenix",
    width: "95"
  }))));
};