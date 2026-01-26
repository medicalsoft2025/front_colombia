export const labplusConfigFields = [{
  field: "LABPLUS_URL",
  label: "URL",
  type: "text"
}, {
  field: "LABPLUS_TOKEN",
  label: "Token",
  type: "text"
}];
export const dgiiConfigFields = [{
  field: "DGII_FILE",
  label: "Certificado P12",
  type: "file",
  description: "Certificado P12 del DGII"
}, {
  field: "DGII_PASSWORD",
  label: "Contraseña",
  type: "password",
  description: "Contraseña del certificado P12"
}, {
  field: "DGII_TENANTS",
  label: "Tenants",
  type: "list",
  source: "DGII_TENANTS",
  sourceType: "static",
  multiple: false,
  placeholder: "Seleccione un tenant"
}, {
  field: "DGII_USERS",
  label: "Usuarios",
  type: "list",
  source: "USERS",
  sourceType: "api",
  multiple: true,
  placeholder: "Seleccione un usuario"
}];
export const sisproConfigFields = [{
  field: "SISPRO_ID_TYPE",
  label: "Tipo de identificación",
  type: "list",
  source: "SISPRO_ID_TYPE",
  sourceType: "static",
  multiple: false,
  placeholder: "Seleccione un tipo de identificación"
}, {
  field: "SISPRO_ID",
  label: "Identificación",
  type: "text",
  placeholder: "Ingrese la identificación"
}, {
  field: "SISPRO_USERNAME",
  label: "Nombre de usuario",
  type: "text",
  placeholder: "Ingrese el nombre de usuario"
}, {
  field: "SISPRO_PASSWORD",
  label: "Contraseña",
  type: "password",
  placeholder: "Ingrese la contraseña"
}];
export const carnetConfigFields = [{
  field: "CARNET_USERNAME",
  label: "Usuario",
  type: "text"
}, {
  field: "CARNET_CLIENT_ID",
  label: "Identificación del cliente",
  type: "text"
}, {
  field: "CARNET_API_KEY",
  label: "API Key",
  type: "text"
}, {
  field: "CARNET_API_SECRET",
  label: "API Secret",
  type: "text"
}];
export const aiConfigFields = [{
  field: "GROQ_API_KEY",
  label: "Groq API Key",
  type: "password"
}, {
  field: "GROQ_MODEL",
  label: "Modelo",
  type: "list",
  source: "GROQ_MODELS",
  sourceType: "api",
  multiple: false,
  placeholder: "Seleccione un modelo"
}, {
  field: "GROQ_MODEL_FALLBACK",
  label: "Modelo de respaldo",
  type: "list",
  source: "GROQ_MODELS",
  sourceType: "api",
  multiple: false,
  placeholder: "Seleccione un modelo de respaldo"
}, {
  field: "CLINICAL_RECORD_SUMMARY_PROMPT",
  label: "Prompt para resumen de la historia clínica",
  type: "code-editor"
}, {
  field: "PATIENT_SUMMARY_PROMPT",
  label: "Prompt para resumen del paciente",
  type: "code-editor"
}, {
  field: "ASK_PATIENT_QUESTIONS_PROMPT",
  label: "Prompt para preguntas del paciente",
  type: "code-editor"
}];
export const geminiConfigFields = [{
  field: "GEMINI_API_KEY",
  label: "API Key",
  type: "text"
}];
export const testConfigFields = [{
  field: "TEST_SHOW_TEST_2",
  label: "Mostrar Test 2",
  type: "checkbox"
}];