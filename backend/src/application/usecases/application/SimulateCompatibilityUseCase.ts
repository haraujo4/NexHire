import { IJobRepository } from "../../../core/interfaces/IJobRepository";
import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { IAIProvider } from "../../../core/interfaces/IAIProvider";
import { IAIAnalysisCacheRepository } from "../../../infrastructure/repositories/AIAnalysisCacheRepository";
import crypto from 'crypto';

export class SimulateCompatibilityUseCase {
    constructor(
        private readonly jobRepo: IJobRepository,
        private readonly candidateRepo: ICandidateRepository,
        private readonly aiProvider: IAIProvider,
        private readonly cacheRepo: IAIAnalysisCacheRepository
    ) { }

    async execute(candidateId: string, jobId: string, formResponses?: any): Promise<any> {
        const job = await this.jobRepo.findById(jobId);
        const profile = await this.candidateRepo.getProfileByCandidateId(candidateId);

        if (!job) throw new Error("Vaga não encontrada");
        if (!profile) throw new Error("Perfil do candidato não encontrado. Por favor, preencha seu perfil antes de se candidatar.");

        // Generate fingerprints to detect changes
        const currentProfileFingerprint = crypto.createHash('md5').update(JSON.stringify({
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
            academicInfo: profile.academicInfo,
            professionalInfo: profile.professionalInfo
        })).digest('hex');

        const currentJobFingerprint = crypto.createHash('md5').update(JSON.stringify({
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
            const cachedResult = cache.analysisResult as any;
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
        } catch (error) {
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

    private evaluateProceed(job: any, aiResult: any): boolean {
        // Base compatibility score check
        if (job.isEliminatory && aiResult.compatibility_score < 50) return false;

        // AI can also return a specific flag if it deems incompatible based on custom form
        if (aiResult.incompatible_by_form) return false;

        return true;
    }
}

