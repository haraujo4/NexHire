"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
class Application {
    constructor(id, candidateId, jobId, status, compatibilityScore, aiAnalysis, formResponses, createdAt, updatedAt, job, candidate) {
        this.id = id;
        this.candidateId = candidateId;
        this.jobId = jobId;
        this.status = status;
        this.compatibilityScore = compatibilityScore;
        this.aiAnalysis = aiAnalysis;
        this.formResponses = formResponses;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.job = job;
        this.candidate = candidate;
    }
}
exports.Application = Application;
