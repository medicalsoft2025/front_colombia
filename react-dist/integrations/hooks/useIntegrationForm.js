import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
export const useIntegrationForm = props => {
  const {
    configs,
    initialConfigFields
  } = props;
  const {
    register,
    setValue,
    handleSubmit,
    control
  } = useForm();
  const {
    append: appendFile,
    remove: removeFile,
    update: updateFile
  } = useFieldArray({
    control,
    name: "files"
  });
  const [configFields, setConfigFields] = useState([]);
  useEffect(() => {
    if (!initialConfigFields || initialConfigFields.length === 0) return;
    console.log("Configs:", configs);
    console.log("Initial Config Fields:", initialConfigFields);
    initialConfigFields.forEach(field => {
      const config = configs.find(config => config.key_ === field.field);
      if (config) {
        field.initialValue = config.value;
      }
    });
    setConfigFields(initialConfigFields);
  }, [configs, initialConfigFields]);
  useEffect(() => {
    configFields.forEach(field => {
      register(field.field, {
        value: field.initialValue
      });
    });
  }, [configFields]);
  return {
    configFields,
    setValue,
    handleSubmit,
    appendFile,
    removeFile,
    updateFile
  };
};