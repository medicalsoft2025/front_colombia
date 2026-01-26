import { useQuery } from "@tanstack/react-query";
import { MenuService } from "../services/MenuService";
import { Menu } from "../interfaces/models";

export const useMenus = () => {

    const menuService = new MenuService();

    const { data: menus, isLoading, error, refetch } = useQuery<Menu[]>({
        queryKey: ["menus"],
        queryFn: async () => {
            const response = await menuService.withSubmenus()
            return response.menus;
        },
    });

    return {
        menus,
        isLoading,
        error,
        refetch
    }
}