import BaseApiService from "./baseApiService.js";

export class CopaymentRulesService extends BaseApiService {
  async getAllFilter(params) {
    return await this.httpClient.get(
      `${this.microservice}${this.version}/${this.endpoint}`,
      params,
    );
  }

  async getRuleByAppointment(id) {
    return await this.httpClient.get(
      `${this.microservice}${this.version}/${this.endpoint}/appointment/${id}`,
    );
  }
}

export default CopaymentRulesService;
