import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { Candidate, CandidateProfile } from "../../../core/entities/Candidate";

export class GetCandidateProfileUseCase {
    constructor(private readonly candidateRepo: ICandidateRepository) { }

    async execute(candidateId: string): Promise<{ candidate: Candidate, profile: CandidateProfile | null }> {
        const candidate = await this.candidateRepo.findById(candidateId);
        if (!candidate) throw new Error("Candidato não encontrado");

        const profile = await this.candidateRepo.getProfileByCandidateId(candidateId);
        return { candidate, profile };
    }
}
