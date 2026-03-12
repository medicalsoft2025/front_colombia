import { usePRToast } from "../../hooks/usePRToast";
import { useState } from "react";
import SystemConfigService from "../../../services/api/classes/systemConfigService";

export const useSystemConfigCreate = () => {
  const systemConfigService = new SystemConfigService();
  const [loading, setLoading] = useState<boolean>(false);
  const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

  const createSystemConfig = async (data: any, companyId: any = null) => {
    try {
      setLoading(true);
      console.log("System Configs:", { configs: data, company_id: companyId });
      const response = await systemConfigService.storeSystemConfig({
        configs: data,
        company_id: companyId,
      });
      showSuccessToast({
        title: "Configuración guardada",
        message: "La configuración se ha guardado correctamente",
      });
      return response;
    } catch (error) {
      console.log(error);
      showServerErrorsToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSystemConfig,
    loading,
    toast,
  };
};
