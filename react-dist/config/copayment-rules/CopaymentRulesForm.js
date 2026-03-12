import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
export const CopaymentRulesForm = ({
  companyId = null,
  onSave = () => {}
}) => {
  const toast = React.useRef(null);
  const regimeTypes = [{
    value: "contributory",
    label: "Contributivo"
  }, {
    value: "subsidiary",
    label: "Subsidiado"
  }];
  const attentionTypes = [{
    value: "consultation",
    label: "Consulta"
  }, {
    value: "procedure",
    label: "Procedimiento"
  }];
  const levelOptions = [{
    value: "1",
    label: "Nivel 1"
  }, {
    value: "2",
    label: "Nivel 2"
  }];
  const categoryOptions = [{
    value: "A",
    label: "Categoría A"
  }, {
    value: "B",
    label: "Categoría B"
  }, {
    value: "C",
    label: "Categoría C"
  }];
  const affiliateTypes = [{
    value: "1",
    label: "Cotizante"
  }, {
    value: "2",
    label: "Benefeciario"
  }];
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    watch
  } = useForm({
    defaultValues: {
      regimeType: "",
      attentionType: "",
      affiliateType: "",
      level: "",
      category: "",
      valueType: "fixed",
      value: 0
    }
  });
  const onSubmit = async data => {
    const payload = {
      regime_type: data.regimeType,
      attention_type: data.attentionType,
      affiliate_type: data.regimeType === "contributory" ? data.affiliateType : "",
      category: data.regimeType === "contributory" ? data.category : "",
      value_type: data.attentionType === "consultation" ? "fixed" : "percentage",
      value: data.value.toFixed(2),
      level: data.regimeType === "subsidiary" ? data.level : "",
      is_copayment_entity: false,
      company_id: companyId
    };
    onSave(payload);
  };
  const getFormErrorMessage = fieldName => {
    return errors[fieldName] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[fieldName]?.message);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    title: "Reglas para copagos"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "regimeType"
  }, "R\xE9gimen"), /*#__PURE__*/React.createElement(Controller, {
    name: "regimeType",
    control: control,
    rules: {
      required: "El régimen es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: regimeTypes,
      placeholder: "Seleccione un r\xE9gimen",
      className: classNames({
        "p-invalid": fieldState.error
      })
    }), getFormErrorMessage("regimeType"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "attentionType"
  }, "Tipo de atenci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "attentionType",
    control: control,
    rules: {
      required: "El tipo de atención es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: attentionTypes,
      placeholder: "Seleccione un tipo de atenci\xF3n",
      className: classNames({
        "p-invalid": fieldState.error
      })
    }), getFormErrorMessage("attentionType"))
  })), watch("regimeType") === "contributory" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "affiliateType"
  }, "Tipo de afiliaci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "affiliateType",
    control: control,
    rules: {
      required: "La categoría es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: affiliateTypes,
      placeholder: "Seleccione un tipo de afiliaci\xF3n",
      className: classNames({
        "p-invalid": fieldState.error
      })
    }), getFormErrorMessage("affiliateType"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "category"
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement(Controller, {
    name: "category",
    control: control,
    rules: {
      required: "La categoría es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: categoryOptions,
      placeholder: "Seleccione una categor\xEDa",
      className: classNames({
        "p-invalid": fieldState.error
      })
    }), getFormErrorMessage("category"))
  })), watch("attentionType") === "consultation" && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "value"
  }, "Valor"), /*#__PURE__*/React.createElement(Controller, {
    name: "value",
    control: control,
    rules: {
      required: "El valor es requerido",
      min: {
        value: 0,
        message: "El valor debe ser mayor a 0"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      className: classNames({
        "p-invalid": fieldState.error
      })
    }), getFormErrorMessage("value"))
  })), watch("attentionType") === "procedure" && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "value"
  }, "Valor"), /*#__PURE__*/React.createElement(Controller, {
    name: "value",
    control: control,
    rules: {
      required: "El valor es requerido",
      min: {
        value: 0,
        message: "El valor debe ser mayor a 0"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      prefix: "%",
      min: 0,
      max: 100,
      onValueChange: e => field.onChange(e.value),
      className: classNames({
        "p-invalid": fieldState.error
      })
    }), getFormErrorMessage("value"))
  }))), watch("regimeType") === "subsidiary" && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "level"
  }, "Nivel"), /*#__PURE__*/React.createElement(Controller, {
    name: "level",
    control: control,
    rules: {
      required: "El nivel es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: levelOptions,
      placeholder: "Seleccione un nivel",
      className: classNames({
        "p-invalid": fieldState.error
      })
    }), getFormErrorMessage("level"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end pt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-save me-2",
    style: {
      marginLeft: "10px"
    }
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};