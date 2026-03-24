import BaseApiService from "./baseApiService.js";

export class ResourcesAdminService extends BaseApiService {
  static getAssetCategories() {
    throw new Error("Method not implemented.");
  }
  async getThirdParties() {
    return await this.httpClient.get(`${this.microservice}/third-parties`);
  }

  async getAssetCategories() {
    return await this.httpClient.get(`api/v1/admin/asset-categories`);
  }

  async getServices() {
    return await this.httpClient.get(`api/v1/admin/products/servicios`);
  }

  async getAdvancePayments(thirdPartyId, type) {
    return await this.httpClient.get(
      `${this.microservice}/third-party/${thirdPartyId}/advance/${type}`
    );
  }

  //resources to api dian

  async getDocumentTypes() {
    return await this.httpClient.get(`api/v1/admin/resources-co/type-document`);
  }

  async getOrganizationTypes() {
    return await this.httpClient.get(`api/v1/admin/resources-co/organizations`);
  }

  async getMunicipalities() {
    return await this.httpClient.get(`api/v1/admin/resources-co/municipalities`);
  }

  async getLiabilityTypes() {
    return await this.httpClient.get(`api/v1/admin/resources-co/type-liabilities`);
  }

  async getRegimeTypes() {
    return await this.httpClient.get(`api/v1/admin/resources-co/type-regimes`);
  }

  async getHealthTypeOperations() {
    return await this.httpClient.get(`api/v1/admin/resources-co/health-type-operations`);
  }

  async getHealthCoverages() {
    return await this.httpClient.get(`api/v1/admin/resources-co/health-coverages`);
  }

  async getHealthPaymentMethods() {
    return await this.httpClient.get(`api/v1/admin/resources-co/health-payment-methods`);
  }

  async getHealthDocumentTypes() {
    return await this.httpClient.get(`api/v1/admin/resources-co/health-document-types`);
  }

  async getHealthUserTypes() {
    return await this.httpClient.get(`api/v1/admin/resources-co/health-user-types`);
  }

  async getPaymentMethods() {
    return await this.httpClient.get(`api/v1/admin/resources-co/payment-methods`);
  }
}

export default ResourcesAdminService;
