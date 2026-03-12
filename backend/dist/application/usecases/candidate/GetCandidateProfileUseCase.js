"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCandidateProfileUseCase = void 0;
class GetCandidateProfileUseCase {
    constructor(candidateRepo) {
        this.candidateRepo = candidateRepo;
    }
    async execute(candidateId) {
        const candidate = await this.candidateRepo.findById(candidateId);
        if (!candidate)
            throw new Error("Candidato não encontrado");
        const profile = await this.candidateRepo.getProfileByCandidateId(candidateId);
        return { candidate, profile };
    }
}
exports.GetCandidateProfileUseCase = GetCandidateProfileUseCase;
