import { Menubar } from "primereact/menubar";
import React, { useEffect } from "react";
import { navbarMenuStyle } from "./styles/navBarMegaMenu";
import { useMenuItems } from "./hooks/useMenuItems";
import NavbarSkeleton from "../skeleton/NavbarSkeleton";
import { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { authService } from "../../../services/api";
import { getUserLogged } from "../../../services/utilidades";

const NavbarHeader = () => {
  const { menuItems: menuItemsFromHook, loading, tenantConfig  } = useMenuItems();
  const userLogged = getUserLogged();

  const iconTemplate = (iconClass) => {
    return iconClass ? <i className={iconClass}></i> : null;
  };

  const processItems = (items) => {
    if (!items || !Array.isArray(items)) return [];

    return items.map((item) => {
      const processedItem: MenuItem = {
        label: item.label,
        url: item.url,
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
    return <NavbarSkeleton />;
  }

  async function loginBridgeOn() {
    const loginUserData: any = localStorage.getItem("loginUserData");
    const loginUserDataJson = JSON.parse(loginUserData);
    const payload = {
      email: loginUserDataJson.email,
      username: loginUserDataJson.username,
    }
    const response = await authService.loginBridge(payload);
    console.log("response", response);
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-center">
        {tenantConfig?.is_migration === true && (
          <Button
            label="Medical anterior"
            className="custom-menu-button"
            style={{ height: "fit-content" }}
            onClick={loginBridgeOn}
          >
            <i className="fas fa-arrow-right-to-bracket"></i>
          </Button>
        )}
        <Menubar
          model={processedItems}
          className="custom-responsive-megamenu"
        />
      </div>
      <style>{navbarMenuStyle}</style>
    </>
  );
};

export default NavbarHeader;
