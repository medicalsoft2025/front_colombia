import BaseApiService from "./baseApiService.js";

export class ResourcesMedicalService extends BaseApiService {
  async getConsultationTypesRips() {
    return await this.httpClient.get(`medical/consultation-types-rips`);
  }

  async getCareModesRips() {
    return await this.httpClient.get(`medical/care-modes-rips`);
  }

  async getServiceGroupsRips() {
    return await this.httpClient.get(`medical/service-groups-rips`);
  }

  async getServiceCodesRips() {
    return await this.httpClient.get(`medical/service-codes-rips`);
  }

  async getConsultationPurposesRips() {
    return await this.httpClient.get(`medical/consultation-purposes-rips`);
  }

  async getExternalCausesRips() {
    return await this.httpClient.get(`medical/external-causes-rips`);
  }
}

export default ResourcesMedicalService;
