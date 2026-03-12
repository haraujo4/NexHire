"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulateCompatibilityUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
class SimulateCompatibilityUseCase {
    constructor(jobRepo, candidateRepo, aiProvider, cacheRepo) {
        this.jobRepo = jobRepo;
        this.candidateRepo = candidateRepo;
        this.aiProvider = aiProvider;
        this.cacheRepo = cacheRepo;
    }
    async execute(candidateId, jobId, formResponses) {
        const job = await this.jobRepo.findById(jobId);
        const profile = await this.candidateRepo.getProfileByCandidateId(candidateId);
        if (!job)
            throw new Error("Vaga não encontrada");
        if (!profile)
            throw new Error("Perfil do candidato não encontrado. Por favor, preencha seu perfil antes de se candidatar.");
        // Generate fingerprints to detect changes
        const currentProfileFingerprint = crypto_1.default.createHash('md5').update(JSON.stringify({
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
            academicInfo: profile.academicInfo,
            professionalInfo: profile.professionalInfo
        })).digest('hex');
        const currentJobFingerprint = crypto_1.default.createHash('md5').update(JSON.stringify({
            description: job.description,
            requirements: job.requirements,
            customForm: job.customForm
        })).digest('hex');
        // Check Cache - If fingerprints match and we have a cached result, return it
        // Only if formResponses are also provided or same (formResponses can be part of candidate fingerprint if we want)
        // Actually, formResponses are specific to this application attempt.
        const cache = await this.cacheRepo.find(candidateId, jobId);
        if (cache && cache.profileFingerprint === currentProfileFingerprint && cache.jobFingerprint === currentJobFingerprint) {
            console.log("[AI Cache] Usando resultado cacheado para", candidateId, jobId);
            const cachedResult = cache.analysisResult;
            return {
                ...cachedResult,
                can_proceed: this.evaluateProceed(job, cachedResult)
            };
        }
        try {
            const aiResult = await this.aiProvider.analyzeCandidate({
                jobDescription: job.description,
                jobRequirements: job.requirements,
                candidateProfile: {
                    skills: profile.skills,
                    experience: profile.experience,
                    education: profile.education,
                    academicInfo: profile.academicInfo,
                    professionalInfo: profile.professionalInfo
                },
                formResponses: formResponses // NEW: Include user answers
            });
            // Save to Cache
            await this.cacheRepo.save(candidateId, jobId, currentProfileFingerprint, currentJobFingerprint, aiResult);
            return {
                ...aiResult,
                can_proceed: this.evaluateProceed(job, aiResult)
            };
        }
        catch (error) {
            console.error("AI Simulation failed", error);
            return {
                compatibility_score: 50,
                strengths: ["Análise indisponível no momento"],
                weaknesses: [],
                recommended_roles: [],
                can_proceed: true
            };
        }
    }
    evaluateProceed(job, aiResult) {
        // Base compatibility score check
        if (job.isEliminatory && aiResult.compatibility_score < 50)
            return false;
        // AI can also return a specific flag if it deems incompatible based on custom form
        if (aiResult.incompatible_by_form)
            return false;
        return true;
    }
}
exports.SimulateCompatibilityUseCase = SimulateCompatibilityUseCase;
