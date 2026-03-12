"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const Job_1 = require("../../core/entities/Job");
const prisma_1 = require("../database/prisma");
class JobRepository {
    async findById(id) {
        const data = await prisma_1.prisma.job.findUnique({
            where: { id },
            include: { _count: { select: { applications: true } } }
        });
        if (!data)
            return null;
        return new Job_1.Job(data.id, data.companyId, data.title, data.description, data.requirements, data.salaryRange, data.location, data.isActive, data.isEliminatory, data.customForm, data.jobFingerprint, data.createdAt, data.updatedAt, data._count);
    }
    async findAll(companyId) {
        const whereClause = companyId ? { companyId } : {};
        const data = await prisma_1.prisma.job.findMany({
            where: whereClause,
            include: { _count: { select: { applications: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return data.map((j) => new Job_1.Job(j.id, j.companyId, j.title, j.description, j.requirements, j.salaryRange, j.location, j.isActive, j.isEliminatory, j.customForm, j.jobFingerprint, j.createdAt, j.updatedAt, j._count));
    }
    async create(jobData) {
        const data = await prisma_1.prisma.job.create({
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
        return new Job_1.Job(data.id, data.companyId, data.title, data.description, data.requirements, data.salaryRange, data.location, data.isActive, data.isEliminatory, data.customForm, data.jobFingerprint, data.createdAt, data.updatedAt);
    }
    async update(id, jobData) {
        const data = await prisma_1.prisma.job.update({
            where: { id },
            data: jobData
        });
        return new Job_1.Job(data.id, data.companyId, data.title, data.description, data.requirements, data.salaryRange, data.location, data.isActive, data.isEliminatory, data.customForm, data.jobFingerprint, data.createdAt, data.updatedAt);
    }
    async delete(id) {
        await prisma_1.prisma.job.delete({ where: { id } });
    }
}
exports.JobRepository = JobRepository;
