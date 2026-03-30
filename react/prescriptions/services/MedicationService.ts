import BaseApiService from "../../../services/api/classes/baseApiService";

class MedicationService extends BaseApiService {
    async getAll() {
        return await this.httpClient.get(`medical/medications`);
    }
}

export const medicationService = new MedicationService();