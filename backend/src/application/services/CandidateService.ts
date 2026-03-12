import { ICandidateService } from "../../core/interfaces/services/ICandidateService";
import { Candidate, CandidateProfile } from "../../core/entities/Candidate";
import { RegisterCandidateUseCase } from "../usecases/candidate/RegisterCandidateUseCase";
import { LoginCandidateUseCase } from "../usecases/candidate/LoginCandidateUseCase";
import { GetCandidateProfileUseCase } from "../usecases/candidate/GetCandidateProfileUseCase";
import { UpdateCandidateProfileUseCase } from "../usecases/candidate/UpdateCandidateProfileUseCase";
import { ExtractCVDataUseCase } from "../usecases/candidate/ExtractCVDataUseCase";
import { SummarizeCandidateProfileUseCase } from "../usecases/candidate/SummarizeCandidateProfileUseCase";
import { CVExtractedData } from "../../core/interfaces/IAIProvider";

export class CandidateService implements ICandidateService {
    constructor(
        private readonly registerUC: RegisterCandidateUseCase,
        private readonly loginUC: LoginCandidateUseCase,
        private readonly getProfileUC: GetCandidateProfileUseCase,
        private readonly updateProfileUC: UpdateCandidateProfileUseCase,
        private readonly extractCVUC: ExtractCVDataUseCase,
        private readonly summarizeProfileUC: SummarizeCandidateProfileUseCase
    ) { }

    async register(name: string, email: string, passwordPlain: string): Promise<{ candidate: Candidate, token: string }> {
        return this.registerUC.execute(name, email, passwordPlain);
    }

    async login(email: string, passwordPlain: string): Promise<{ candidate: Candidate, token: string }> {
        return this.loginUC.execute(email, passwordPlain);
    }

    async getProfile(candidateId: string): Promise<{ candidate: Candidate, profile: CandidateProfile | null }> {
        return this.getProfileUC.execute(candidateId);
    }

    async getCandidateProfile(candidateId: string): Promise<{ candidate: Candidate, profile: CandidateProfile | null }> {
        return this.getProfileUC.execute(candidateId);
    }

    async updateProfile(candidateId: string, profileData: any): Promise<CandidateProfile> {
        return this.updateProfileUC.execute(candidateId, profileData);
    }

    async summarizeProfile(candidateId: string): Promise<CandidateProfile> {
        return this.summarizeProfileUC.execute(candidateId);
    }

    async extractCVData(fileBuffer: Buffer, mimetype: string): Promise<CVExtractedData> {
        return this.extractCVUC.execute(fileBuffer, mimetype);
    }
}
