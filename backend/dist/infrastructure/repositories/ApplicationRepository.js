"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepository = void 0;
const Application_1 = require("../../core/entities/Application");
const prisma_1 = require("../database/prisma");
class ApplicationRepository {
    async findById(id) {
        const data = await prisma_1.prisma.application.findUnique({
            where: { id },
            include: {
                job: { include: { company: true } },
                candidate: true
            }
        });
        if (!data)
            return null;
        return new Application_1.Application(data.id, data.candidateId, data.jobId, data.status, data.compatibilityScore, data.aiAnalysis, data.formResponses, data.createdAt, data.updatedAt, data.job, data.candidate);
    }
    async findByJobId(jobId) {
        const data = await prisma_1.prisma.application.findMany({
            where: { jobId },
            include: {
                candidate: true,
                job: { include: { company: true } }
            },
            orderBy: { compatibilityScore: 'desc' }
        });
        return data.map((a) => new Application_1.Application(a.id, a.candidateId, a.jobId, a.status, a.compatibilityScore, a.aiAnalysis, a.formResponses, a.createdAt, a.updatedAt, a.job, a.candidate));
    }
    async findByCandidateId(candidateId) {
        const data = await prisma_1.prisma.application.findMany({
            where: { candidateId },
            include: {
                job: { include: { company: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return data.map((a) => new Application_1.Application(a.id, a.candidateId, a.jobId, a.status, a.compatibilityScore, a.aiAnalysis, a.formResponses, a.createdAt, a.updatedAt, a.job));
    }
    async create(appData) {
        const data = await prisma_1.prisma.application.create({
            data: {
                candidateId: appData.candidateId,
                jobId: appData.jobId,
                status: appData.status,
                compatibilityScore: appData.compatibilityScore,
                aiAnalysis: appData.aiAnalysis,
                formResponses: appData.formResponses
            }
        });
        return new Application_1.Application(data.id, data.candidateId, data.jobId, data.status, data.compatibilityScore, data.aiAnalysis, data.formResponses, data.createdAt, data.updatedAt);
    }
    async updateStatus(id, status) {
        const data = await prisma_1.prisma.application.update({
            where: { id },
            data: { status }
        });
        return new Application_1.Application(data.id, data.candidateId, data.jobId, data.status, data.compatibilityScore, data.aiAnalysis, data.formResponses, data.createdAt, data.updatedAt);
    }
    async updateAIAnalysis(id, score, analysis) {
        const data = await prisma_1.prisma.application.update({
            where: { id },
            data: {
                compatibilityScore: score,
                aiAnalysis: analysis
            }
        });
        return new Application_1.Application(data.id, data.candidateId, data.jobId, data.status, data.compatibilityScore, data.aiAnalysis, data.formResponses, data.createdAt, data.updatedAt);
    }
}
exports.ApplicationRepository = ApplicationRepository;
