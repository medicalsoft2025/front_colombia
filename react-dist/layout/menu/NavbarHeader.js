import { Menubar } from "primereact/menubar";
import React from "react";
import { navbarMenuStyle } from "./styles/navBarMegaMenu.js";
import { useMenuItems } from "./hooks/useMenuItems.js";
import NavbarSkeleton from "../skeleton/NavbarSkeleton.js";
import { Button } from "primereact/button";
import { authService } from "../../../services/api/index.js";
import { getUserLogged } from "../../../services/utilidades.js";
const NavbarHeader = () => {
  const {
    menuItems: menuItemsFromHook,
    loading,
    tenantConfig
  } = useMenuItems();
  const userLogged = getUserLogged();
  const iconTemplate = iconClass => {
    return iconClass ? /*#__PURE__*/React.createElement("i", {
      className: iconClass
    }) : null;
  };
  const processItems = items => {
    if (!items || !Array.isArray(items)) return [];
    return items.map(item => {
      const processedItem = {
        label: item.label,
        url: item.url
      };
      if (item.dynamic_form_id) {
        processedItem.url = `appFormsCrud?dynamic_form_id=${item.dynamic_form_id}`;
      }
      if (item.icon) {
        processedItem.icon = () => iconTemplate(item.icon);
      }
      if (item.items && item.items.length > 0) {
        processedItem.items = processItems(item.items);
      }
      return processedItem;
    });
  };
  const processedItems = processItems(menuItemsFromHook);
  if (loading) {
    return /*#__PURE__*/React.createElement(NavbarSkeleton, null);
  }
  async function loginBridgeOn() {
    const loginUserData = localStorage.getItem("loginUserData");
    const loginUserDataJson = JSON.parse(loginUserData);
    const payload = {
      email: loginUserDataJson.email,
      username: loginUserDataJson.username
    };
    const response = await authService.loginBridge(payload);
    console.log("response", response);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-center"
  }, tenantConfig?.is_migration === true && /*#__PURE__*/React.createElement(Button, {
    label: "Medical anterior",
    className: "custom-menu-button",
    style: {
      height: "fit-content"
    },
    onClick: loginBridgeOn
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-right-to-bracket"
  })), /*#__PURE__*/React.createElement(Menubar, {
    model: processedItems,
    className: "custom-responsive-megamenu"
  })), /*#__PURE__*/React.createElement("style", null, navbarMenuStyle));
};
export default NavbarHeader;