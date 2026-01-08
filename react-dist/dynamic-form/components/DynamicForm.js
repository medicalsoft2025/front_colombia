import React, { forwardRef, useMemo } from "react";
import { DynamicFormContainer } from "./containers/DynamicFormContainer.js";
import { useDynamicForm } from "../hooks/useDynamicForm.js";
import { FormProvider as FormProviderRHF } from "react-hook-form";
import { useFieldConditions } from "../hooks/useFieldConditions.js";
import { FormProvider } from "../providers/FormProvider.js";
export const DynamicForm = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    config,
    data,
    onSubmit,
    loading,
    className = "",
    onChange,
    setFormInvalid,
    executeFieldConditionsOnInit = false,
    onElementSelect
  } = props;
  const {
    form,
    emitSubmitData
  } = useDynamicForm({
    config,
    data,
    onSubmit,
    onChange,
    setFormInvalid,
    ref
  });
  const {
    fieldStates
  } = useFieldConditions({
    config,
    form,
    executeOnInit: !data || executeFieldConditionsOnInit
  });
  const formContextValue = useMemo(() => ({
    fieldStates,
    setFieldState: (fieldPath, state) => {},
    form: form,
    onElementSelect
  }), [fieldStates, form, onElementSelect]);
  return /*#__PURE__*/React.createElement(FormProviderRHF, form, /*#__PURE__*/React.createElement(FormProvider, {
    value: formContextValue
  }, /*#__PURE__*/React.createElement("form", {
    className: className
  }, (config.children || config.containers)?.map((child, index) => /*#__PURE__*/React.createElement(DynamicFormContainer, {
    key: child.name || `element-${index}`,
    config: child,
    loading: loading,
    onSubmit: emitSubmitData,
    form: form
  })))));
});