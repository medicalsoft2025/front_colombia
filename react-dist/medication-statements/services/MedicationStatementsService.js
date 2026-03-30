import BaseApiService from "../../../services/api/classes/baseApiService.js";
const mapMedicationStatementDto = data => ({
  id: data.id,
  patientId: data.patient_id,
  medicationId: data.medication_id ? Number(data.medication_id) : null,
  medicationName: data.medication_name,
  dosage: data.dosage,
  notes: data.notes,
  status: data.status,
  createdAt: data.created_at,
  updatedAt: data.updated_at
});
export class MedicationStatementsService extends BaseApiService {
  constructor() {
    super("medical", "medication-statements");
  }
  async getMedicationsByPatient(patientId) {
    const response = await this.httpClient.get(`medical/patients/${patientId}/medication-statements`);
    const resData = response.data.data || response.data;
    return Array.isArray(resData) ? resData.map(mapMedicationStatementDto) : [];
  }
  async createMedication(patientId, data) {
    const payload = {
      medication_id: data.medicationId,
      medication_name: data.medicationName,
      dosage: data.dosage,
      notes: data.notes,
      status: data.status
    };
    const response = await this.httpClient.post(`medical/patients/${patientId}/medication-statements`, payload);
    const resData = response.data.data || response.data;
    return mapMedicationStatementDto(resData);
  }
  async updateMedication(id, data) {
    const payload = {
      medication_id: data.medicationId,
      medication_name: data.medicationName,
      dosage: data.dosage,
      notes: data.notes,
      status: data.status
    };
    const response = await this.httpClient.put(`medical/medication-statements/${id}`, payload);
    const resData = response.data.data || response.data;
    return mapMedicationStatementDto(resData);
  }
  async updateMedicationStatus(id, status) {
    await this.httpClient.put(`medical/medication-statements/${id}/status`, {
      status
    });
  }
  async deleteMedication(id) {
    await this.httpClient.delete(`medical/medication-statements/${id}`);
  }
  async getMedicationHistory(medicationStatementId) {
    const response = await this.httpClient.get(`medical/medication-statements/${medicationStatementId}/history`);
    const resData = response.data.data || response.data;
    return Array.isArray(resData) ? resData.map(h => {
      let changedByName = 'Sistema';
      if (h.changed_by_user) {
        changedByName = h.changed_by_user.full_name || `${h.changed_by_user.first_name} ${h.changed_by_user.last_name}`;
      } else if (h.changed_by && typeof h.changed_by === 'object') {
        changedByName = h.changed_by.full_name || `${h.changed_by.first_name} ${h.changed_by.last_name}`;
      } else if (h.changed_by) {
        changedByName = `Usuario ID: ${h.changed_by}`;
      }
      return {
        id: h.id,
        medicationStatementId: h.medication_statement_id,
        previousStatus: h.previous_status,
        newStatus: h.new_status,
        changedBy: changedByName,
        changedAt: h.changed_at
      };
    }) : [];
  }
}
export const medicationStatementsService = new MedicationStatementsService();