import { prisma } from "../database/prisma";

export interface IAIAnalysisCacheRepository {
    find(candidateId: string, jobId: string): Promise<any | null>;
    save(candidateId: string, jobId: string, profileFingerprint: string, jobFingerprint: string, result: any): Promise<void>;
    deleteByCandidate(candidateId: string): Promise<void>;
    deleteByJob(jobId: string): Promise<void>;
}

export class AIAnalysisCacheRepository implements IAIAnalysisCacheRepository {
    async find(candidateId: string, jobId: string): Promise<any | null> {
        return await prisma.aIAnalysisCache.findUnique({
            where: { candidateId_jobId: { candidateId, jobId } }
        });
    }

    async save(candidateId: string, jobId: string, profileFingerprint: string, jobFingerprint: string, result: any): Promise<void> {
        await prisma.aIAnalysisCache.upsert({
            where: { candidateId_jobId: { candidateId, jobId } },
            update: {
                profileFingerprint,
                jobFingerprint,
                analysisResult: result,
                createdAt: new Date()
            },
            create: {
                candidateId,
                jobId,
                profileFingerprint,
                jobFingerprint,
                analysisResult: result
            }
        });
    }

    async deleteByCandidate(candidateId: string): Promise<void> {
        await prisma.aIAnalysisCache.deleteMany({ where: { candidateId } });
    }

    async deleteByJob(jobId: string): Promise<void> {
        await prisma.aIAnalysisCache.deleteMany({ where: { jobId } });
    }
}
