import { Job } from "../../core/entities/Job";
import { IJobRepository } from "../../core/interfaces/IJobRepository";
import { prisma } from "../database/prisma";

export class JobRepository implements IJobRepository {
    async findById(id: string): Promise<Job | null> {
        const data = await prisma.job.findUnique({
            where: { id },
            include: { _count: { select: { applications: true } } }
        });
        if (!data) return null;
        return new Job(data.id, data.companyId, data.title, data.description, data.requirements, data.salaryRange, data.location, data.isActive, data.isEliminatory, data.customForm, data.jobFingerprint, data.createdAt, data.updatedAt, data._count);
    }

    async findAll(companyId?: string): Promise<Job[]> {
        const whereClause = companyId ? { companyId } : {};
        const data = await prisma.job.findMany({
            where: whereClause,
            include: { _count: { select: { applications: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return data.map((j: any) => new Job(j.id, j.companyId, j.title, j.description, j.requirements, j.salaryRange, j.location, j.isActive, j.isEliminatory, j.customForm, j.jobFingerprint, j.createdAt, j.updatedAt, j._count));
    }

    async create(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
        const data = await prisma.job.create({
            data: {
                companyId: jobData.companyId,
                title: jobData.title,
                description: jobData.description,
                requirements: jobData.requirements,
                salaryRange: jobData.salaryRange,
                location: jobData.location,
                isActive: jobData.isActive,
                isEliminatory: jobData.isEliminatory,
                customForm: jobData.customForm,
                jobFingerprint: jobData.jobFingerprint
            }
        });
        return new Job(data.id, data.companyId, data.title, data.description, data.requirements, data.salaryRange, data.location, data.isActive, data.isEliminatory, data.customForm, data.jobFingerprint, data.createdAt, data.updatedAt);
    }

    async update(id: string, jobData: Partial<Omit<Job, 'id' | 'companyId' | 'createdAt'>>): Promise<Job> {
        const data = await prisma.job.update({
            where: { id },
            data: jobData
        });
        return new Job(data.id, data.companyId, data.title, data.description, data.requirements, data.salaryRange, data.location, data.isActive, data.isEliminatory, data.customForm, data.jobFingerprint, data.createdAt, data.updatedAt);
    }

    async delete(id: string): Promise<void> {
        await prisma.job.delete({ where: { id } });
    }
}
