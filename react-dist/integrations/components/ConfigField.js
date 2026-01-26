import React from "react";
import { ConfigFieldText } from "./ConfigFieldText.js";
import { ConfigFieldFile } from "./ConfigFieldFile.js";
import { ConfigFieldPassword } from "./ConfigFieldPassword.js";
import { ConfigFieldList } from "./ConfigFieldList.js";
import { ConfigFieldCheckbox } from "./ConfigFieldCheckbox.js";
import { ConfigFieldTextArea } from "./ConfigFieldTextArea.js";
import { ConfigFieldCodeEditor } from "./ConfigFieldCodeEditor.js";
export const ConfigField = props => {
  const {
    field,
    label,
    type,
    initialValue,
    onChange,
    onFileChange,
    multiple,
    source,
    sourceType,
    placeholder,
    description
  } = props;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2 mb-3 w-100"
  }, type === "text" && /*#__PURE__*/React.createElement(ConfigFieldText, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    placeholder: placeholder
  }), type === "textarea" && /*#__PURE__*/React.createElement(ConfigFieldTextArea, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    placeholder: placeholder
  }), type === "code-editor" && /*#__PURE__*/React.createElement(ConfigFieldCodeEditor, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    placeholder: placeholder
  }), type === "password" && /*#__PURE__*/React.createElement(ConfigFieldPassword, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    placeholder: placeholder
  }), type === "file" && /*#__PURE__*/React.createElement(ConfigFieldFile, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    onFileChange: onFileChange,
    placeholder: placeholder
  }), type === "list" && /*#__PURE__*/React.createElement(ConfigFieldList, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    multiple: multiple,
    source: source,
    sourceType: sourceType,
    placeholder: placeholder
  }), type === "checkbox" && /*#__PURE__*/React.createElement(ConfigFieldCheckbox, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, description)));
};