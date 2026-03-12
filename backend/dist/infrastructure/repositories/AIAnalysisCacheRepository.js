"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAnalysisCacheRepository = void 0;
const prisma_1 = require("../database/prisma");
class AIAnalysisCacheRepository {
    async find(candidateId, jobId) {
        return await prisma_1.prisma.aIAnalysisCache.findUnique({
            where: { candidateId_jobId: { candidateId, jobId } }
        });
    }
    async save(candidateId, jobId, profileFingerprint, jobFingerprint, result) {
        await prisma_1.prisma.aIAnalysisCache.upsert({
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
    async deleteByCandidate(candidateId) {
        await prisma_1.prisma.aIAnalysisCache.deleteMany({ where: { candidateId } });
    }
    async deleteByJob(jobId) {
        await prisma_1.prisma.aIAnalysisCache.deleteMany({ where: { jobId } });
    }
}
exports.AIAnalysisCacheRepository = AIAnalysisCacheRepository;
