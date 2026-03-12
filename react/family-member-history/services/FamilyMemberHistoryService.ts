import BaseApiService from "../../../services/api/classes/baseApiService";
import {
    FamilyMemberHistoryDto,
    CreateFamilyMemberHistoryDto,
    UpdateFamilyMemberHistoryDto,
    FamilyMemberHistoryHistoryDto
} from "../interfaces/models";

const mapFamilyMemberHistoryDto = (data: any): FamilyMemberHistoryDto => ({
    id: data.id,
    patientId: data.patient_id,
    relationshipCode: data.relationship_code,
    cie11: `${data.diagnosis?.codigo} - ${data.diagnosis?.descripcion}`,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
});

export class FamilyMemberHistoryService extends BaseApiService {
    constructor() {
        super("medical", "family-member-history");
    }

    async getHistoryByPatient(patientId: number): Promise<FamilyMemberHistoryDto[]> {
        const response = await this.httpClient.get(`medical/patients/${patientId}/family-member-history`);
        const resData = response.data.data || response.data;
        return Array.isArray(resData) ? resData.map(mapFamilyMemberHistoryDto) : [];
    }

    async createRecord(patientId: number, data: Omit<CreateFamilyMemberHistoryDto, 'patientId'>): Promise<FamilyMemberHistoryDto> {
        const payload = {
            relationship_code: data.relationshipCode,
            cie11: data.cie11,
            status: data.status
        };
        const response = await this.httpClient.post(`medical/patients/${patientId}/family-member-history`, payload);
        const resData = response.data.data || response.data;
        return mapFamilyMemberHistoryDto(resData);
    }

    async updateRecord(id: number, data: UpdateFamilyMemberHistoryDto): Promise<FamilyMemberHistoryDto> {
        const payload = {
            relationship_code: data.relationshipCode,
            cie11: data.cie11,
            status: data.status
        };
        const response = await this.httpClient.put(`medical/family-member-history/${id}`, payload);
        const resData = response.data.data || response.data;
        return mapFamilyMemberHistoryDto(resData);
    }

    async updateStatus(id: number, status: string): Promise<void> {
        await this.httpClient.put(`medical/family-member-history/${id}/status`, { status });
    }

    async deleteRecord(id: number): Promise<void> {
        await this.httpClient.delete(`medical/family-member-history/${id}`);
    }

    async getChangeHistory(id: number): Promise<FamilyMemberHistoryHistoryDto[]> {
        const response = await this.httpClient.get(`medical/family-member-history/${id}/history`);
        const resData = response.data.data || response.data;
        return Array.isArray(resData) ? resData.map((h: any) => ({
            id: h.id,
            familyMemberHistoryId: h.family_member_history_id,
            previousStatus: h.previous_status,
            newStatus: h.new_status,
            changedBy: h.changed_by ? h.changed_by.full_name : 'Sistema',
            changedAt: h.changed_at
        })) : [];
    }
}
