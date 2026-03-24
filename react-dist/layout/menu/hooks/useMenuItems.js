import { menuService } from "../../../../services/api/index.js";
import { useQuery } from "@tanstack/react-query";
import { tenantConfigService } from "../../../../services/api/index.js";
import React, { useEffect } from "react";
const sortMenus = menus => {
  return menus.sort((a, b) => (a.order || 0) - (b.order || 0)).map(item => {
    if (item.items && item.items.length > 0) {
      return {
        ...item,
        items: sortMenus(item.items)
      };
    }
    return item;
  });
};
export const useMenuItems = () => {
  const [tenantConfig, setTenantConfig] = React.useState(null);
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["logged-user-menus"],
    queryFn: () => menuService.getAllMenuForRQ(),
    placeholderData: {
      menus: []
    },
    select: data => {
      const menus = data?.menus?.menus || [];
      return sortMenus(menus);
    }
  });
  async function loadTenantConfig() {
    const tenantConfig = await tenantConfigService.getConfig();
    setTenantConfig(tenantConfig);
  }
  useEffect(() => {
    loadTenantConfig();
  }, []);
  return {
    menuItems: data || [],
    loading: isLoading || isFetching,
    refetch,
    tenantConfig
  };
};