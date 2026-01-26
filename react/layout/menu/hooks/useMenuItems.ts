import { menuService } from "../../../../services/api";
import { useQuery } from "@tanstack/react-query";

const transformBackendMenu = (backendItems) => {
  return backendItems
    .map((item) => ({
      label: item.name,
      icon: item.icon,
      url: item.route,
      items:
        item.children && item.children.length > 0
          ? transformBackendMenu(item.children)
          : undefined,
    }))
    .filter((item) => item.label);
};

const removeEmptySections = (menu) => {
  return menu
    .map((item) => {
      if (item.items) {
        const children = removeEmptySections(item.items);
        if (children.length > 0) {
          return { ...item, items: children };
        }
      }

      if (item.url || (item.items && item.items.length > 0)) {
        return item;
      }

      return null;
    })
    .filter(Boolean);
};

export const useMenuItems = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["logged-user-menus"],
    queryFn: () => menuService.getAllMenuForRQ(),
    placeholderData: { menus: [] }
  })

  return { menuItems: data?.menus.menus || [], loading: isLoading || isFetching, refetch };
};
