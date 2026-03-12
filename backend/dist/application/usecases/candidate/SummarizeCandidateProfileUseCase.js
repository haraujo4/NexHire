"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummarizeCandidateProfileUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
class SummarizeCandidateProfileUseCase {
    constructor(candidateRepo, aiProvider) {
        this.candidateRepo = candidateRepo;
        this.aiProvider = aiProvider;
    }
    async execute(candidateId) {
        const profile = await this.candidateRepo.getProfileByCandidateId(candidateId);
        if (!profile)
            throw new Error("Perfil do candidato não encontrado.");
        const summaries = await this.aiProvider.summarizeProfile({
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
            academicInfo: profile.academicInfo,
            professionalInfo: profile.professionalInfo
        });
        const aiSummaryFingerprint = crypto_1.default.createHash('md5').update(JSON.stringify({
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
            academicInfo: profile.academicInfo,
            professionalInfo: profile.professionalInfo
        })).digest('hex');
        return this.candidateRepo.updateProfile(candidateId, {
            aiSummary: summaries.general,
            aiExperienceSummary: summaries.experience,
            aiAcademicSummary: summaries.academic,
            aiSummaryFingerprint
        });
    }
}
exports.SummarizeCandidateProfileUseCase = SummarizeCandidateProfileUseCase;
