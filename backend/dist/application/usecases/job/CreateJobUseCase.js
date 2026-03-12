"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobUseCase = void 0;
class CreateJobUseCase {
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(companyId, title, description, requirements, salaryRange, location, isEliminatory, customForm, jobFingerprint) {
        return this.jobRepo.create({
            companyId,
            title,
            description,
            requirements,
            salaryRange: salaryRange || null,
            location: location || null,
            isActive: true,
            isEliminatory: isEliminatory || false,
            customForm: customForm || null,
            jobFingerprint: jobFingerprint || null
        });
    }
}
exports.CreateJobUseCase = CreateJobUseCase;
