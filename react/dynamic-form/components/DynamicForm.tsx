import React, { forwardRef, Ref, useMemo } from "react";
import { DynamicFormElementConfig } from "../interfaces/models";
import { DynamicFormContainer } from "./containers/DynamicFormContainer";
import { useDynamicForm } from "../hooks/useDynamicForm";
import { FieldValues, UseFormReturn, FormProvider as FormProviderRHF } from "react-hook-form";
import { useFieldConditions } from "../hooks/useFieldConditions";
import { FormContextValue } from "../context/FormContext";
import { FormProvider } from "../providers/FormProvider";

interface DynamicFormProps<T extends FieldValues> {
    config: DynamicFormElementConfig;
    onSubmit: (data: T) => void;
    data?: T | null;
    loading?: boolean;
    className?: string;
    onChange?: (data: T) => void;
    setFormInvalid?: (invalid: boolean) => void;
    executeFieldConditionsOnInit?: boolean;
    onElementSelect?: (config: DynamicFormElementConfig | any) => void;
    sources?: Record<string, (params?: any) => Promise<any[]>>;
}

export interface DynamicFormRef {
    handleSubmit: () => Promise<void>;
}

export const DynamicForm = forwardRef(
    <T extends FieldValues>(
        props: DynamicFormProps<T>,
        ref: Ref<DynamicFormRef>
    ) => {
        const {
            config,
            data,
            onSubmit,
            loading,
            className = "",
            onChange,
            setFormInvalid,
            executeFieldConditionsOnInit = false,
            onElementSelect,
            sources,
        } = props;

        const { form, emitSubmitData } = useDynamicForm<T>({
            config,
            data,
            onSubmit,
            onChange,
            setFormInvalid,
            ref,
        });

        const { fieldStates } = useFieldConditions({ config, form, executeOnInit: !data || executeFieldConditionsOnInit });

        const formContextValue = useMemo(
            () =>
            ({
                fieldStates,
                setFieldState: (fieldPath: string, state: Partial<any>) => {
                },
                form: form as UseFormReturn<FieldValues>,
                onElementSelect,
                sources
            } as FormContextValue),
            [fieldStates, form, onElementSelect, sources]
        );

        return (
            <FormProviderRHF {...form}>
                <FormProvider value={formContextValue}>
                    <form className={className}>
                        {(config.children || config.containers)?.map((child, index) => (
                            <DynamicFormContainer
                                key={child.name || `element-${index}`}
                                config={child}
                                loading={loading}
                                onSubmit={emitSubmitData}
                                form={form}
                            />
                        ))}
                    </form>
                </FormProvider>
            </FormProviderRHF>
        );
    }
);
