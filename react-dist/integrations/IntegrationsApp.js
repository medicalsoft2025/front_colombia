import React from "react";
import { IntegrationsTabs } from "./components/IntegrationsTabs.js";
import { SystemConfigHelper } from "./helpers/SystemConfigHelper.js";
import { carnetConfigFields, dgiiConfigFields, labplusConfigFields, aiConfigFields, sisproConfigFields } from "./config/formFields.js";
import { IntegrationConfig } from "./forms/IntegrationConfig.js";
import { useSystemConfigs } from "../system-configs/hooks/useSystemConfigs.js";
import { useSystemConfigCreate } from "../system-configs/hooks/useSystemConfigCreate.js";
import { Toast } from "primereact/toast";
import { IframeIntegration } from "./forms/IframeIntegration.js";
export const IntegrationsApp = ({
  companyId = null
}) => {
  const {
    systemConfigs: configs,
    refetch
  } = useSystemConfigs(Number(companyId));
  const {
    createSystemConfig,
    toast
  } = useSystemConfigCreate();
  const handleSubmit = async data => {
    const systemConfigs = SystemConfigHelper.formatDataToSystemConfigArray(data);
    await createSystemConfig(systemConfigs, Number(companyId));
    refetch();
  };
  const tabs = [{
    id: "labplus-tab",
    label: "Labplus",
    icon: "fa-solid fa-plus",
    content: /*#__PURE__*/React.createElement(IntegrationConfig, {
      configs: configs,
      configFields: labplusConfigFields,
      onSubmit: handleSubmit
    })
  }, {
    id: "dgii-tab",
    label: "DGII",
    icon: "fa-solid fa-file-invoice",
    content: /*#__PURE__*/React.createElement(IntegrationConfig, {
      configs: configs,
      configFields: dgiiConfigFields,
      onSubmit: handleSubmit
    })
  }, {
    id: "sispro-tab",
    label: "SISPRO",
    icon: "fa-solid fa-address-book",
    content: /*#__PURE__*/React.createElement(IntegrationConfig, {
      configs: configs,
      configFields: sisproConfigFields,
      onSubmit: handleSubmit
    })
  }, {
    id: "carnet-tab",
    label: "Carnet",
    icon: "fa-solid fa-envelopes-bulk",
    content: /*#__PURE__*/React.createElement(IntegrationConfig, {
      configs: configs,
      configFields: carnetConfigFields,
      onSubmit: handleSubmit
    })
  }, {
    id: "ai-tab",
    label: "AI",
    icon: "fa-solid fa-brain",
    content: /*#__PURE__*/React.createElement(IntegrationConfig, {
      configs: configs,
      configFields: aiConfigFields,
      onSubmit: handleSubmit
    })
  }, {
    id: "iframe-tab",
    label: "Iframe",
    icon: "fa-solid fa-code",
    content: /*#__PURE__*/React.createElement(IframeIntegration, null)
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(IntegrationsTabs, {
    tabs: tabs
  }));
};