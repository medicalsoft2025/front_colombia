import BaseApiService from "../../../services/api/classes/baseApiService";
import { statuses } from "../consts";
import { LoadDto, PackageDto, ProcessTypeDto, ReasonDto, ResponsibleDto, LoadHistoryDto } from "../interfaces/models";

// Helper functions for mapping snake_case from API to camelCase for UI
const mapPackageDto = (data: any): PackageDto => ({
    id: data.id,
    name: data.name,
    prefix: data.prefix,
    content: data.content
});

const mapLoadDto = (data: any): LoadDto => ({
    id: data.id,
    processTypeId: data.process_type_id,
    reasonId: data.reason_id,
    sterilizationDate: data.sterilization_date.split('T')[0],
    startTime: data.start_time,
    durationMinutes: data.duration_minutes,
    endTime: data.end_time,
    temperature: parseFloat(data.temperature),
    pressure: parseFloat(data.pressure),
    validityDays: data.validity_days,
    expirationDate: data.expiration_date.split('T')[0],
    responsibleId: data.responsible_id,
    responsibleName: data.responsible.full_name,
    chemicalControl: !!data.chemical_control,
    biologicalControl: !!data.biological_control,
    observations: data.observations || '',
    status: data.status,
    packages: data.packages ? data.packages.map(mapPackageDto) : []
});

export class SterilizationService extends BaseApiService {
    constructor() {
        super("medical", "sterilizations"); // Using empty strings, we will use full paths like '/sterilizations/...'
    }

    // PACKAGES
    async getPackages(params?: { page: number, perPage: number, search?: string }): Promise<{ data: PackageDto[], total: number }> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.perPage) queryParams.append('per_page', params.perPage.toString());
        if (params?.search) queryParams.append('search', params.search);

        const response = await this.httpClient.get(`medical/sterilizations/packages?${queryParams.toString()}`);
        return {
            data: response.data.map(mapPackageDto),
            total: response.data.length
        };
    }

    async createPackage(data: Omit<PackageDto, 'id'>): Promise<PackageDto> {
        const response = await this.httpClient.post('medical/sterilizations/packages', data);
        return mapPackageDto(response.data);
    }

    async updatePackage(id: number, data: Omit<PackageDto, 'id'>): Promise<PackageDto> {
        const response = await this.httpClient.put(`medical/sterilizations/packages/${id}`, data);
        return mapPackageDto(response.data);
    }

    async deletePackage(id: number): Promise<void> {
        await this.httpClient.delete(`medical/sterilizations/packages/${id}`);
    }

    // LOADS
    async getLoads(params: { page: number, perPage: number, search?: string, status?: string, sterilizationDate?: string }): Promise<{ data: LoadDto[], total: number }> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.perPage) queryParams.append('per_page', params.perPage.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.sterilizationDate) queryParams.append('sterilization_date', params.sterilizationDate);

        const response = await this.httpClient.get(`medical/sterilizations/loads?${queryParams.toString()}`);
        return {
            data: response.data.data.map(mapLoadDto),
            total: response.data.total || response.data.data.length
        };
    }

    async createLoad(data: Omit<LoadDto, 'id' | 'status'>): Promise<LoadDto> {
        const payload = {
            process_type_id: data.processTypeId,
            reason_id: data.reasonId,
            sterilization_date: data.sterilizationDate,
            start_time: data.startTime instanceof Date ? data.startTime.toTimeString().split(' ')[0] : data.startTime,
            duration_minutes: data.durationMinutes,
            end_time: data.endTime instanceof Date ? data.endTime.toTimeString().split(' ')[0] : data.endTime,
            temperature: data.temperature,
            pressure: data.pressure,
            validity_days: data.validityDays,
            expiration_date: data.expirationDate instanceof Date ? data.expirationDate.toISOString().split('T')[0] : data.expirationDate,
            responsible_id: data.responsibleId,
            chemical_control: data.chemicalControl,
            biological_control: data.biologicalControl,
            observations: data.observations,
            status: 'in_progress',
            packages: data.packages.map(p => ({ id: p.id }))
        };

        const response = await this.httpClient.post('medical/sterilizations/loads', payload);
        return mapLoadDto(response.data);
    }

    async updateLoadStatus(id: number, status: string): Promise<void> {
        await this.httpClient.put(`medical/sterilizations/loads/${id}/status`, { status });
    }

    async getLoadHistory(loadId: number): Promise<LoadHistoryDto[]> {
        const response = await this.httpClient.get(`medical/sterilizations/loads/${loadId}/history`);
        return response.data.map((h: any) => ({
            id: h.id,
            loadId: h.load_id,
            previousStatus: statuses[h.previous_status],
            newStatus: statuses[h.new_status],
            changedBy: h.user ? h.user.full_name : (h.changed_by || 'Sistema'),
            changedAt: h.changed_at
        }));
    }
}
