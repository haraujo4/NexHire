"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetJobsUseCase = void 0;
class GetJobsUseCase {
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(companyId) {
        return this.jobRepo.findAll(companyId);
    }
}
exports.GetJobsUseCase = GetJobsUseCase;
