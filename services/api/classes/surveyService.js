import BaseApiService from "./baseApiService.js";

export class SurveyService extends BaseApiService {

    async getAllFilter(params) {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}`, params);
    }

    async saveConfigurationSurvey(data){
        return await this.httpClient.post(`${this.microservice}/configure-surveys`, data);
    }

}

export default SurveyService;