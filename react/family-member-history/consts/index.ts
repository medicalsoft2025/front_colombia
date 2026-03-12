export const relationshipCodes = [
    { label: "Progenitores (Padres)", value: "01" },
    { label: "Hermanos", value: "02" },
    { label: "Tíos", value: "03" },
    { label: "Abuelos", value: "04" }
];

export const familyMemberHistoryStatuses = [
    { label: "Parcial", value: "partial" },
    { label: "Completado", value: "completed" },
    { label: "Ingresado por error", value: "entered-in-error" },
    { label: "Salud desconocida", value: "health-unknown" }
];

export const relationshipCodeMap: Record<string, string> = {
    '01': 'Progenitores (Padres)',
    '02': 'Hermanos',
    '03': 'Tíos',
    '04': 'Abuelos'
};

export const familyMemberHistoryStatusMap: Record<string, string> = {
    'partial': 'Parcial',
    'completed': 'Completado',
    'entered-in-error': 'Ingresado por error',
    'health-unknown': 'Salud desconocida'
};
