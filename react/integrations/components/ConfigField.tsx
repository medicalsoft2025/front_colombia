import React from "react";
import { ConfigFieldText } from "./ConfigFieldText";
import { ConfigFieldFile } from "./ConfigFieldFile";
import { ConfigFieldPassword } from "./ConfigFieldPassword";
import { ConfigFieldList } from "./ConfigFieldList";
import { ConfigFieldCheckbox } from "./ConfigFieldCheckbox";
import { ConfigFieldTextArea } from "./ConfigFieldTextArea";
import { ConfigFieldCodeEditor } from "./ConfigFieldCodeEditor";
import { DynamicConfigFieldProps } from "../interfaces";

export const ConfigField = (props: DynamicConfigFieldProps) => {
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

    return (
        <>
            <div className="d-flex flex-column gap-2 mb-3 w-100">
                {type === "text" && (
                    <ConfigFieldText
                        field={field}
                        label={label}
                        initialValue={initialValue}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                )}
                {type === "textarea" && (
                    <ConfigFieldTextArea
                        field={field}
                        label={label}
                        initialValue={initialValue}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                )}
                {type === "code-editor" && (
                    <ConfigFieldCodeEditor
                        field={field}
                        label={label}
                        initialValue={initialValue}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                )}
                {type === "password" && (
                    <ConfigFieldPassword
                        field={field}
                        label={label}
                        initialValue={initialValue}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                )}
                {type === "file" && (
                    <ConfigFieldFile
                        field={field}
                        label={label}
                        initialValue={initialValue}
                        onChange={onChange}
                        onFileChange={onFileChange}
                        placeholder={placeholder}
                    />
                )}
                {type === "list" && (
                    <ConfigFieldList
                        field={field}
                        label={label}
                        initialValue={initialValue}
                        onChange={onChange}
                        multiple={multiple}
                        source={source}
                        sourceType={sourceType}
                        placeholder={placeholder}
                    />
                )}
                {type === "checkbox" && (
                    <ConfigFieldCheckbox
                        field={field}
                        label={label}
                        initialValue={initialValue}
                        onChange={onChange}
                    />
                )}
                <small className="text-muted">{description}</small>
            </div>
        </>
    );
};
