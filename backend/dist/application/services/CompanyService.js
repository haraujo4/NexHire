"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
class CompanyService {
    constructor(registerUC, loginUC, getStatsUC, getProfileUC, updateProfileUC) {
        this.registerUC = registerUC;
        this.loginUC = loginUC;
        this.getStatsUC = getStatsUC;
        this.getProfileUC = getProfileUC;
        this.updateProfileUC = updateProfileUC;
    }
    async register(name, email, passwordPlain) {
        return this.registerUC.execute(name, email, passwordPlain);
    }
    async login(email, passwordPlain) {
        return this.loginUC.execute(email, passwordPlain);
    }
    async getProfile(companyId) {
        return this.getProfileUC.execute(companyId);
    }
    async updateProfile(companyId, profileData) {
        return this.updateProfileUC.execute(companyId, profileData);
    }
    async getStats(companyId) {
        return this.getStatsUC.execute(companyId);
    }
}
exports.CompanyService = CompanyService;
