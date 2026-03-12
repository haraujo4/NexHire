import { Application, ApplicationStatus } from "../../core/entities/Application";
import { IApplicationRepository } from "../../core/interfaces/IApplicationRepository";
import { prisma } from "../database/prisma";

export class ApplicationRepository implements IApplicationRepository {
    async findById(id: string): Promise<Application | null> {
        const data = await prisma.application.findUnique({
            where: { id },
            include: {
                job: { include: { company: true } },
                candidate: { include: { profile: true } }
            }
        });
        if (!data) return null;
        return new Application(
            data.id,
            data.candidateId,
            data.jobId,
            data.status as ApplicationStatus,
            data.compatibilityScore,
            data.aiAnalysis,
            data.formResponses,
            data.createdAt,
            data.updatedAt,
            data.job,
            data.candidate
        );
    }

    async findByJobId(jobId: string): Promise<Application[]> {
        const data = await prisma.application.findMany({
            where: { jobId },
            include: {
                candidate: { include: { profile: true } },
                job: { include: { company: true } }
            },
            orderBy: { compatibilityScore: 'desc' }
        });
        return data.map((a: any) => new Application(
            a.id,
            a.candidateId,
            a.jobId,
            a.status as ApplicationStatus,
            a.compatibilityScore,
            a.aiAnalysis,
            a.formResponses,
            a.createdAt,
            a.updatedAt,
            a.job,
            a.candidate
        ));
    }

    async findByCandidateId(candidateId: string): Promise<Application[]> {
        const data = await prisma.application.findMany({
            where: { candidateId },
            include: {
                job: { include: { company: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return data.map((a: any) => new Application(
            a.id,
            a.candidateId,
            a.jobId,
            a.status as ApplicationStatus,
            a.compatibilityScore,
            a.aiAnalysis,
            a.formResponses,
            a.createdAt,
            a.updatedAt,
            a.job
        ));
    }

    async create(appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
        const data = await prisma.application.create({
            data: {
                candidateId: appData.candidateId,
                jobId: appData.jobId,
                status: appData.status,
                compatibilityScore: appData.compatibilityScore,
                aiAnalysis: appData.aiAnalysis,
                formResponses: appData.formResponses
            }
        });
        return new Application(data.id, data.candidateId, data.jobId, data.status as ApplicationStatus, data.compatibilityScore, data.aiAnalysis, data.formResponses, data.createdAt, data.updatedAt);
    }

    async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
        const data = await prisma.application.update({
            where: { id },
            data: { status }
        });
        return new Application(data.id, data.candidateId, data.jobId, data.status as ApplicationStatus, data.compatibilityScore, data.aiAnalysis, data.formResponses, data.createdAt, data.updatedAt);
    }

    async updateAIAnalysis(id: string, score: number, analysis: string): Promise<Application> {
        const data = await prisma.application.update({
            where: { id },
            data: {
                compatibilityScore: score,
                aiAnalysis: analysis
            }
        });
        return new Application(data.id, data.candidateId, data.jobId, data.status as ApplicationStatus, data.compatibilityScore, data.aiAnalysis, data.formResponses, data.createdAt, data.updatedAt);
    }
}
