import { DynamicFormElementConfig } from "../../dynamic-form/interfaces/models";

export const tableFilters: DynamicFormElementConfig = {
    type: "container",
    children: [
        {
            type: "accordion",
            children: [
                {
                    type: "container",
                    label: "Filtrar evoluciones",
                    contentStyleClass: "row g-3",
                    children: [
                        {
                            type: "date",
                            name: "date",
                            label: "Fechas",
                            styleClass: "col-md-6"
                        },
                        {
                            type: "select",
                            name: "doctors",
                            label: "Doctores",
                            styleClass: "col-md-6",
                            asyncOptions: {
                                sourceKey: "doctors",
                                labelKey: "label",
                                valueKey: "id"
                            }
                        },
                        {
                            type: "select",
                            name: "clinicalRecordType",
                            label: "Tipo de historia clínica",
                            styleClass: "col-md-12"
                        },
                    ],
                }
            ]
        }
    ]
};