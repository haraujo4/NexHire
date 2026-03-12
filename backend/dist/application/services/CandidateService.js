"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateService = void 0;
class CandidateService {
    constructor(registerUC, loginUC, getProfileUC, updateProfileUC, extractCVUC) {
        this.registerUC = registerUC;
        this.loginUC = loginUC;
        this.getProfileUC = getProfileUC;
        this.updateProfileUC = updateProfileUC;
        this.extractCVUC = extractCVUC;
    }
    async register(name, email, passwordPlain) {
        return this.registerUC.execute(name, email, passwordPlain);
    }
    async login(email, passwordPlain) {
        return this.loginUC.execute(email, passwordPlain);
    }
    async getProfile(candidateId) {
        return this.getProfileUC.execute(candidateId);
    }
    async getCandidateProfile(candidateId) {
        return this.getProfileUC.execute(candidateId);
    }
    async updateProfile(candidateId, profileData) {
        return this.updateProfileUC.execute(candidateId, profileData);
    }
    async extractCVData(fileBuffer, mimetype) {
        return this.extractCVUC.execute(fileBuffer, mimetype);
    }
}
exports.CandidateService = CandidateService;
