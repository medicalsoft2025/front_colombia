import React from "react";
import { IntegrationsTabs } from "./components/IntegrationsTabs";
import { SystemConfigHelper } from "./helpers/SystemConfigHelper";
import { carnetConfigFields, dgiiConfigFields, labplusConfigFields, aiConfigFields, sisproConfigFields } from "./config/formFields";
import { IntegrationConfig } from "./forms/IntegrationConfig";
import { useSystemConfigs } from "../system-configs/hooks/useSystemConfigs";
import { useSystemConfigCreate } from "../system-configs/hooks/useSystemConfigCreate";
import { Toast } from "primereact/toast";

export const IntegrationsApp = () => {

    const { systemConfigs: configs, refetch } = useSystemConfigs();
    const { createSystemConfig, toast } = useSystemConfigCreate();

    const handleSubmit = async (data: any) => {
        const systemConfigs = SystemConfigHelper.formatDataToSystemConfigArray(data);
        await createSystemConfig(systemConfigs);
        refetch();
    }

    const tabs = [
        {
            id: "labplus-tab",
            label: "Labplus",
            icon: "fa-solid fa-plus",
            content: <IntegrationConfig configs={configs} configFields={labplusConfigFields} onSubmit={handleSubmit} />
        },
        {
            id: "dgii-tab",
            label: "DGII",
            icon: "fa-solid fa-file-invoice",
            content: <IntegrationConfig configs={configs} configFields={dgiiConfigFields} onSubmit={handleSubmit} />
        },
        {
            id: "sispro-tab",
            label: "SISPRO",
            icon: "fa-solid fa-address-book",
            content: <IntegrationConfig configs={configs} configFields={sisproConfigFields} onSubmit={handleSubmit} />
        },
        {
            id: "carnet-tab",
            label: "Carnet",
            icon: "fa-solid fa-envelopes-bulk",
            content: <IntegrationConfig configs={configs} configFields={carnetConfigFields} onSubmit={handleSubmit} />
        },
        {
            id: "ai-tab",
            label: "AI",
            icon: "fa-solid fa-brain",
            content: <IntegrationConfig configs={configs} configFields={aiConfigFields} onSubmit={handleSubmit} />
        }
    ];

    return (
        <>
            <Toast ref={toast} />
            <IntegrationsTabs tabs={tabs} />
        </>
    );
};