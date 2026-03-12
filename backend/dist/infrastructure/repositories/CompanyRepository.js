"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const Company_1 = require("../../core/entities/Company");
const prisma_1 = require("../database/prisma");
class CompanyRepository {
    mapToEntity(data) {
        return new Company_1.Company(data.id, data.name, data.email, data.passwordHash, data.createdAt, data.updatedAt, data.profile ? this.mapProfileToEntity(data.profile) : null);
    }
    mapProfileToEntity(data) {
        return new Company_1.CompanyProfile(data.id, data.companyId, data.description, data.website, data.logoUrl, data.industry, data.size, data.address, data.socialLinks, data.createdAt, data.updatedAt);
    }
    async findById(id) {
        const data = await prisma_1.prisma.company.findUnique({
            where: { id },
            include: { profile: true }
        });
        if (!data)
            return null;
        return this.mapToEntity(data);
    }
    async findByEmail(email) {
        const data = await prisma_1.prisma.company.findUnique({
            where: { email },
            include: { profile: true }
        });
        if (!data)
            return null;
        return this.mapToEntity(data);
    }
    async create(companyData) {
        const data = await prisma_1.prisma.company.create({
            data: {
                name: companyData.name,
                email: companyData.email,
                passwordHash: companyData.passwordHash
            },
            include: { profile: true }
        });
        return this.mapToEntity(data);
    }
    async getProfile(companyId) {
        const data = await prisma_1.prisma.companyProfile.findUnique({ where: { companyId } });
        if (!data)
            return null;
        return this.mapProfileToEntity(data);
    }
    async updateProfile(companyId, profileData) {
        const data = await prisma_1.prisma.companyProfile.upsert({
            where: { companyId },
            update: profileData,
            create: {
                companyId,
                ...profileData
            }
        });
        return this.mapProfileToEntity(data);
    }
}
exports.CompanyRepository = CompanyRepository;
