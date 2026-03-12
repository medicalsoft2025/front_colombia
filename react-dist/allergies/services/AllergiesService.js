import BaseApiService from "../../../services/api/classes/baseApiService.js";
const mapAllergyDto = data => ({
  id: data.id,
  patientId: data.patient_id,
  description: data.description,
  type: data.type,
  status: data.status,
  createdAt: data.created_at,
  updatedAt: data.updated_at
});
export class AllergiesService extends BaseApiService {
  constructor() {
    // Base API prefix. We will use absolute-like paths in methods.
    super("medical", "allergies");
  }
  async getAllergiesByPatient(patientId) {
    const response = await this.httpClient.get(`medical/patients/${patientId}/allergies`);
    const resData = response.data.data || response.data;
    return Array.isArray(resData) ? resData.map(mapAllergyDto) : [];
  }
  async createAllergy(patientId, data) {
    const payload = {
      description: data.description,
      type: data.type,
      status: data.status
    };
    const response = await this.httpClient.post(`medical/patients/${patientId}/allergies`, payload);
    const resData = response.data.data || response.data;
    return mapAllergyDto(resData);
  }
  async updateAllergy(id, patientId, data) {
    const payload = {
      description: data.description,
      type: data.type,
      status: data.status
    };
    const response = await this.httpClient.put(`medical/allergies/${id}`, payload);
    const resData = response.data.data || response.data;
    return mapAllergyDto(resData);
  }
  async updateAllergyStatus(id, status) {
    await this.httpClient.put(`medical/allergies/${id}/status`, {
      status
    });
  }
  async deleteAllergy(id) {
    await this.httpClient.delete(`medical/allergies/${id}`);
  }
  async getAllergyHistory(allergyId) {
    const response = await this.httpClient.get(`medical/allergies/${allergyId}/history`);
    return response.data.map(h => ({
      id: h.id,
      allergyId: h.allergy_id,
      previousStatus: h.previous_status,
      newStatus: h.new_status,
      changedBy: h.changed_by ? h.changed_by.full_name : 'Sistema',
      changedAt: h.changed_at
    }));
  }
}