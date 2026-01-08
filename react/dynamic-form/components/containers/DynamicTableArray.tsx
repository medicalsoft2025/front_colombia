import React from "react";
import { FieldValues, UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DynamicFormContainerConfig, DynamicFieldConfig, DynamicFormElementConfig } from "../../interfaces/models";
import { FormProvider } from "../../providers/FormProvider";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { useFieldConditions } from "../../hooks/useFieldConditions";
import { useFormContext } from "../../context/FormContext";

interface DynamicTableArrayProps<T extends FieldValues> {
    config: DynamicFormElementConfig;
    form: UseFormReturn<T>;
    fields: UseFieldArrayReturn<T>["fields"];
    append: UseFieldArrayReturn<T>["append"];
    remove: UseFieldArrayReturn<T>["remove"];
    parentPath: string;
}

export const DynamicTableArray = <T extends FieldValues>({
    config,
    form,
    fields,
    append,
    remove,
    parentPath
}: DynamicTableArrayProps<T>) => {

    const arrayConfig = config.arrayConfig || {};
    const tableConfig = arrayConfig.tableConfig || {};

    const getRealIndex = (rowData: any) => {
        return fields.findIndex((f) => f.id === rowData.id);
    };

    const actionBodyTemplate = (rowData: any) => {
        const index = getRealIndex(rowData);
        return (
            <Button
                icon={<i className="fa fa-trash me-1"></i>}
                className="p-button-danger p-button-text p-button-sm"
                onClick={() => remove(index)}
                type="button"
                tooltip={arrayConfig.removeLabel || "Eliminar"}
            />
        );
    };

    const header = (
        <div className="d-flex justify-content-between align-items-center">
            <span className="text-xl font-bold">{config.label}</span>
            <Button
                label={arrayConfig.addLabel || "Agregar"}
                icon={<i className="fa fa-plus"></i>}
                onClick={() => append({} as any)}
                type="button"
                size="small"
            />
        </div>
    );

    const cellBodyTemplate = (colNode: DynamicFormElementConfig) => (rowData: any) => {

        const realIndex = getRealIndex(rowData);

        const { fieldStates } = useFieldConditions({
            config: config || colNode,
            form,
            basePath: `${parentPath}.${realIndex}`,
        });

        const parentContext = useFormContext();

        const mergedFieldStates = {
            ...parentContext.fieldStates,
            ...fieldStates,
        };

        return (
            <FormProvider value={{
                fieldStates: mergedFieldStates,
                form: form as UseFormReturn<FieldValues>,
                setFieldState: parentContext.setFieldState,
                onElementSelect: parentContext.onElementSelect,
            }}>
                <DynamicFormContainer
                    config={colNode}
                    form={form}
                    parentPath={`${parentPath}.${realIndex}`}
                    className="w-full"
                />
            </FormProvider>
        );
    };

    return (

        <div className={`dynamic-table-array mb-4 ${config.styleClass || ""}`}>
            <DataTable
                value={fields}
                header={header}
                showGridlines={tableConfig.showGridlines}
                stripedRows={tableConfig.stripedRows}
                size="small"
                resizableColumns={tableConfig.resizableColumns}
                reorderableColumns={tableConfig.reorderableColumns}
                paginator={tableConfig.paginator}
                rows={tableConfig.rows || 5}
                tableStyle={{ minWidth: '50rem' }}
                emptyMessage="No hay registros"
            >
                {(config?.children || config?.containers)?.map((col, i) => {
                    const key = col.name || `col-${i}`;
                    const header = col.label || col.name || `Col ${i + 1}`;
                    const fieldName = col.name;

                    return (
                        <Column
                            key={key}
                            header={header}
                            body={cellBodyTemplate(col)}
                            style={{ minWidth: '150px' }}
                            field={fieldName}
                        />
                    )
                })}

                <Column
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ width: '4rem', textAlign: 'center' }}
                />
            </DataTable>
        </div>
    );
};
