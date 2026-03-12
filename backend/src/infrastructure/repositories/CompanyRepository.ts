import { Company, CompanyProfile } from "../../core/entities/Company";
import { ICompanyRepository } from "../../core/interfaces/ICompanyRepository";
import { prisma } from "../database/prisma";

export class CompanyRepository implements ICompanyRepository {
    private mapToEntity(data: any): Company {
        return new Company(
            data.id,
            data.name,
            data.email,
            data.passwordHash,
            data.createdAt,
            data.updatedAt,
            data.profile ? this.mapProfileToEntity(data.profile) : null
        );
    }

    private mapProfileToEntity(data: any): CompanyProfile {
        return new CompanyProfile(
            data.id,
            data.companyId,
            data.description,
            data.website,
            data.logoUrl,
            data.industry,
            data.size,
            data.address,
            data.socialLinks,
            data.createdAt,
            data.updatedAt
        );
    }

    async findById(id: string): Promise<Company | null> {
        const data = await prisma.company.findUnique({
            where: { id },
            include: { profile: true }
        });
        if (!data) return null;
        return this.mapToEntity(data);
    }

    async findByEmail(email: string): Promise<Company | null> {
        const data = await prisma.company.findUnique({
            where: { email },
            include: { profile: true }
        });
        if (!data) return null;
        return this.mapToEntity(data);
    }

    async create(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'profile'>): Promise<Company> {
        const data = await prisma.company.create({
            data: {
                name: companyData.name,
                email: companyData.email,
                passwordHash: companyData.passwordHash
            },
            include: { profile: true }
        });
        return this.mapToEntity(data);
    }

    async getProfile(companyId: string): Promise<CompanyProfile | null> {
        const data = await prisma.companyProfile.findUnique({ where: { companyId } });
        if (!data) return null;
        return this.mapProfileToEntity(data);
    }

    async updateProfile(companyId: string, profileData: Partial<Omit<CompanyProfile, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>>): Promise<CompanyProfile> {
        const data = await prisma.companyProfile.upsert({
            where: { companyId },
            update: profileData,
            create: {
                companyId,
                ...profileData as any
            }
        });
        return this.mapProfileToEntity(data);
    }
}
