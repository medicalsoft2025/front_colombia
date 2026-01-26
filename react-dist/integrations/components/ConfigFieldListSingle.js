import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
export const ConfigFieldListSingle = props => {
  const {
    field,
    label,
    initialValue,
    onChange,
    options,
    placeholder,
    source
  } = props;
  const [value, setValue] = useState(initialValue || "");
  const handleValueChange = e => {
    setValue(e.value);
    onChange(e.value);
  };
  const isGrouped = options && options.length > 0 && Array.isArray(options[0].items);
  const isGroqModels = source === "GROQ_MODELS";
  const itemTemplate = option => {
    if (isGroqModels) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex flex-column"
      }, /*#__PURE__*/React.createElement("div", {
        className: "font-bold"
      }, option.id), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '0.85rem',
          color: '#6c757d'
        }
      }, "Created: ", new Date(option.created * 1000).toLocaleDateString(), " | Ctx: ", option.context_window?.toLocaleString(), " | Max: ", option.max_completion_tokens?.toLocaleString()));
    }
    return option.label;
  };
  const groupTemplate = option => {
    if (isGroqModels) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex align-items-center font-bold"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-layer-group mr-2"
      }), /*#__PURE__*/React.createElement("span", null, option.label));
    }
    return option.label;
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: field,
    className: "form-label"
  }, label), /*#__PURE__*/React.createElement(Dropdown, {
    options: options,
    optionLabel: "label",
    optionValue: "value",
    optionGroupLabel: isGrouped ? "label" : undefined,
    optionGroupChildren: isGrouped ? "items" : undefined,
    optionGroupTemplate: isGrouped ? groupTemplate : undefined,
    itemTemplate: isGroqModels ? itemTemplate : undefined,
    inputId: field,
    name: field,
    value: value,
    onChange: handleValueChange,
    className: "w-100",
    placeholder: placeholder,
    filter: true
  }));
};