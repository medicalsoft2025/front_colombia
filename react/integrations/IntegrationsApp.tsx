import React from "react";
import { IntegrationsTabs } from "./components/IntegrationsTabs";
import { SystemConfigHelper } from "./helpers/SystemConfigHelper";
import {
  carnetConfigFields,
  dgiiConfigFields,
  labplusConfigFields,
  aiConfigFields,
  sisproConfigFields,
} from "./config/formFields";
import { IntegrationConfig } from "./forms/IntegrationConfig";
import { useSystemConfigs } from "../system-configs/hooks/useSystemConfigs";
import { useSystemConfigCreate } from "../system-configs/hooks/useSystemConfigCreate";
import { Toast } from "primereact/toast";
import { IframeIntegration } from "./forms/IframeIntegration";
import { PatientDocumentsForm } from "./components/medical-pay/MedicalPayForm";
import { medicalPayService } from "../../services/api";

export const IntegrationsApp: React.FC<any> = ({ companyId = null }) => {
  const { systemConfigs: configs, refetch } = useSystemConfigs(
    Number(companyId),
  );
  const { createSystemConfig, toast } = useSystemConfigCreate();

  const handleSubmit = async (data: any) => {
    const systemConfigs =
      SystemConfigHelper.formatDataToSystemConfigArray(data);
    await createSystemConfig(systemConfigs, Number(companyId));
    refetch();
  };

  const handleSubmiMedicalPay = async (data: any) => {
    try {
      if (data.id) {
        const response = await medicalPayService.update(data.id, data);
      } else {
        const response = await medicalPayService.create(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tabs = [
    {
      id: "labplus-tab",
      label: "Labplus",
      icon: "fa-solid fa-plus",
      content: (
        <IntegrationConfig
          configs={configs}
          configFields={labplusConfigFields}
          onSubmit={handleSubmit}
        />
      ),
    },
    {
      id: "dgii-tab",
      label: "DGII",
      icon: "fa-solid fa-file-invoice",
      content: (
        <IntegrationConfig
          configs={configs}
          configFields={dgiiConfigFields}
          onSubmit={handleSubmit}
        />
      ),
    },
    {
      id: "sispro-tab",
      label: "SISPRO",
      icon: "fa-solid fa-address-book",
      content: (
        <IntegrationConfig
          configs={configs}
          configFields={sisproConfigFields}
          onSubmit={handleSubmit}
        />
      ),
    },
    {
      id: "carnet-tab",
      label: "Carnet",
      icon: "fa-solid fa-envelopes-bulk",
      content: (
        <IntegrationConfig
          configs={configs}
          configFields={carnetConfigFields}
          onSubmit={handleSubmit}
        />
      ),
    },
    {
      id: "medialPay-tab",
      label: "Medical Pay",
      icon: "fa-solid fa-credit-card",
      content: <PatientDocumentsForm onSave={handleSubmiMedicalPay} />,
    },
    {
      id: "ai-tab",
      label: "AI",
      icon: "fa-solid fa-brain",
      content: (
        <IntegrationConfig
          configs={configs}
          configFields={aiConfigFields}
          onSubmit={handleSubmit}
        />
      ),
    },
    {
      id: "iframe-tab",
      label: "Iframe",
      icon: "fa-solid fa-code",
      content: <IframeIntegration />,
    },
  ];

  return (
    <>
      <Toast ref={toast} />
      <IntegrationsTabs tabs={tabs} />
    </>
  );
};
