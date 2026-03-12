export const allergyTypes = [
    { label: "Medicamento", value: "01" },
    { label: "Alimento", value: "02" },
    { label: "Sustancia del ambiente", value: "03" },
    { label: "Sustancia que entran en contacto con la piel", value: "04" },
    { label: "Picadura de insectos", value: "05" },
    { label: "Otra", value: "06" }
];

export const allergyStatuses = [
    { label: "Activa", value: "active" },
    { label: "Inactiva", value: "inactive" },
    { label: "Resuelta", value: "resolved" }
];

export const statuses: Record<string, string> = {
    'active': 'Activa',
    'inactive': 'Inactiva',
    'resolved': 'Resuelta'
};

export const allergyStatusMap = statuses;

export const allergyTypeMap: Record<string, string> = {
    '01': 'Medicamento',
    '02': 'Alimento',
    '03': 'Sustancia del ambiente',
    '04': 'Sustancia que entran en contacto con la piel',
    '05': 'Picadura de insectos',
    '06': 'Otra'
};
