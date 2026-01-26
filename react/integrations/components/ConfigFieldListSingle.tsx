import React, { useState } from "react";
import { DynamicConfigFieldListProps } from "../interfaces";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

export const ConfigFieldListSingle = (props: DynamicConfigFieldListProps) => {
    const { field, label, initialValue, onChange, options, placeholder, source } = props;

    const [value, setValue] = useState(initialValue || "");

    const handleValueChange = (e: DropdownChangeEvent) => {
        setValue(e.value);
        onChange(e.value);
    };

    const isGrouped = options && options.length > 0 && Array.isArray(options[0].items);
    const isGroqModels = source === "GROQ_MODELS";

    const itemTemplate = (option: any) => {
        if (isGroqModels) {
            return (
                <div className="flex flex-column">
                    <div className="font-bold">{option.id}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                        Created: {new Date(option.created * 1000).toLocaleDateString()} |
                        Ctx: {option.context_window?.toLocaleString()} |
                        Max: {option.max_completion_tokens?.toLocaleString()}
                    </div>
                </div>
            );
        }
        return option.label;
    };

    const groupTemplate = (option: any) => {
        if (isGroqModels) {
            return (
                <div className="flex align-items-center font-bold">
                    <i className="fa-solid fa-layer-group mr-2"></i>
                    <span>{option.label}</span>
                </div>
            );
        }
        return option.label;
    };

    return (
        <>
            <label htmlFor={field} className="form-label">{label}</label>
            <Dropdown
                options={options}
                optionLabel="label"
                optionValue="value"
                optionGroupLabel={isGrouped ? "label" : undefined}
                optionGroupChildren={isGrouped ? "items" : undefined}
                optionGroupTemplate={isGrouped ? groupTemplate : undefined}
                itemTemplate={isGroqModels ? itemTemplate : undefined}
                inputId={field}
                name={field}
                value={value}
                onChange={handleValueChange}
                className="w-100"
                placeholder={placeholder}
                filter
            />
        </>
    );
};