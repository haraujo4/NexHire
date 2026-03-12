"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
class ApplicationService {
    constructor(applyUC, getAppsUC, updateStatusUC, evaluateAIUC, simulateUC) {
        this.applyUC = applyUC;
        this.getAppsUC = getAppsUC;
        this.updateStatusUC = updateStatusUC;
        this.evaluateAIUC = evaluateAIUC;
        this.simulateUC = simulateUC;
    }
    async apply(candidateId, jobId, formResponses) {
        return this.applyUC.execute(candidateId, jobId, formResponses, (id) => this.evaluateAIUC.execute(id));
    }
    async getApplicationsForJob(jobId, companyId) {
        return this.getAppsUC.executeForJob(jobId, companyId);
    }
    async getApplicationsForCandidate(candidateId) {
        return this.getAppsUC.executeForCandidate(candidateId);
    }
    async updateStatus(applicationId, companyId, status) {
        return this.updateStatusUC.execute(applicationId, companyId, status);
    }
    async evaluate(applicationId) {
        const result = await this.evaluateAIUC.execute(applicationId);
        if (!result)
            throw new Error("Falha ao avaliar candidatura ou candidatura não encontrada.");
        return result;
    }
    async simulate(candidateId, jobId, formResponses) {
        return this.simulateUC.execute(candidateId, jobId, formResponses);
    }
}
exports.ApplicationService = ApplicationService;
