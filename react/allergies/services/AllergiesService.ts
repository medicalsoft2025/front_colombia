import BaseApiService from "../../../services/api/classes/baseApiService";
import { AllergyDto, CreateAllergyDto, UpdateAllergyDto, AllergyHistoryDto } from "../interfaces/models";

const mapAllergyDto = (data: any): AllergyDto => ({
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

    async getAllergiesByPatient(patientId: number): Promise<AllergyDto[]> {
        const response = await this.httpClient.get(`medical/patients/${patientId}/allergies`);
        const resData = response.data.data || response.data;
        return Array.isArray(resData) ? resData.map(mapAllergyDto) : [];
    }

    async createAllergy(patientId: number, data: Omit<CreateAllergyDto, 'patientId'>): Promise<AllergyDto> {
        const payload = {
            description: data.description,
            type: data.type,
            status: data.status
        };
        const response = await this.httpClient.post(`medical/patients/${patientId}/allergies`, payload);
        const resData = response.data.data || response.data;
        return mapAllergyDto(resData);
    }

    async updateAllergy(id: number, patientId: number, data: Omit<UpdateAllergyDto, 'patientId'>): Promise<AllergyDto> {
        const payload = {
            description: data.description,
            type: data.type,
            status: data.status
        };
        const response = await this.httpClient.put(`medical/allergies/${id}`, payload);
        const resData = response.data.data || response.data;
        return mapAllergyDto(resData);
    }

    async updateAllergyStatus(id: number, status: string): Promise<void> {
        await this.httpClient.put(`medical/allergies/${id}/status`, { status });
    }

    async deleteAllergy(id: number): Promise<void> {
        await this.httpClient.delete(`medical/allergies/${id}`);
    }

    async getAllergyHistory(allergyId: number): Promise<AllergyHistoryDto[]> {
        const response = await this.httpClient.get(`medical/allergies/${allergyId}/history`);
        return response.data.map((h: any) => ({
            id: h.id,
            allergyId: h.allergy_id,
            previousStatus: h.previous_status,
            newStatus: h.new_status,
            changedBy: h.changed_by ? h.changed_by.full_name : 'Sistema',
            changedAt: h.changed_at
        }));
    }
}
