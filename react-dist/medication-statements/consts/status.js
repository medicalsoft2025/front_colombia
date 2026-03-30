export const MEDICATION_STATEMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ENTERED_IN_ERROR: 'entered-in-error',
  INTENDED: 'intended',
  STOPPED: 'stopped',
  ON_HOLD: 'on-hold',
  UNKNOWN: 'unknown',
  NOT_TAKEN: 'not-taken'
};
export const MEDICATION_STATEMENT_STATUS_LABELS = {
  'active': 'Activo',
  'completed': 'Completado',
  'entered-in-error': 'Error de registro',
  'intended': 'Previsto',
  'stopped': 'Detenido',
  'on-hold': 'En pausa',
  'unknown': 'Desconocido',
  'not-taken': 'No tomado'
};
export const MEDICATION_STATEMENT_STATUS_OPTIONS = Object.entries(MEDICATION_STATEMENT_STATUS_LABELS).map(([value, label]) => ({
  label,
  value
}));