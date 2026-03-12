import { Candidate, CandidateProfile } from "../../core/entities/Candidate";
import { ICandidateRepository } from "../../core/interfaces/ICandidateRepository";
import { prisma } from "../database/prisma";

export class CandidateRepository implements ICandidateRepository {
    async findById(id: string): Promise<Candidate | null> {
        const data = await prisma.candidate.findUnique({ where: { id } });
        if (!data) return null;
        return new Candidate(data.id, data.name, data.email, data.phone, data.location, data.passwordHash, data.createdAt, data.updatedAt);
    }

    async findByEmail(email: string): Promise<Candidate | null> {
        const data = await prisma.candidate.findUnique({ where: { email } });
        if (!data) return null;
        return new Candidate(data.id, data.name, data.email, data.phone, data.location, data.passwordHash, data.createdAt, data.updatedAt);
    }

    async create(candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> {
        const data = await prisma.candidate.create({
            data: {
                name: candidateData.name,
                email: candidateData.email,
                phone: candidateData.phone,
                location: candidateData.location,
                passwordHash: candidateData.passwordHash
            }
        });
        return new Candidate(data.id, data.name, data.email, data.phone, data.location, data.passwordHash, data.createdAt, data.updatedAt);
    }

    async createProfile(profileData: Omit<CandidateProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<CandidateProfile> {
        const data = await prisma.candidateProfile.create({
            data: {
                candidateId: profileData.candidateId,
                skills: profileData.skills,
                experience: profileData.experience,
                education: profileData.education,
                birthDate: profileData.birthDate,
                cpf: profileData.cpf,
                phone2: profileData.phone2,
                gender: profileData.gender,
                address: profileData.address,
                academicInfo: profileData.academicInfo,
                professionalInfo: profileData.professionalInfo,
                socialLinks: profileData.socialLinks,
                portfolioUrl: profileData.portfolioUrl,
                aiSummary: profileData.aiSummary,
                aiExperienceSummary: profileData.aiExperienceSummary,
                aiAcademicSummary: profileData.aiAcademicSummary,
                aiSummaryFingerprint: profileData.aiSummaryFingerprint,
                profileFingerprint: profileData.profileFingerprint
            }
        });
        return new CandidateProfile(
            data.id,
            data.candidateId,
            data.skills,
            data.experience,
            data.education,
            data.birthDate,
            data.cpf,
            data.phone2,
            data.gender,
            data.address,
            data.academicInfo,
            data.professionalInfo,
            data.socialLinks,
            data.portfolioUrl,
            data.aiSummary,
            data.aiExperienceSummary,
            data.aiAcademicSummary,
            data.aiSummaryFingerprint,
            data.profileFingerprint,
            data.createdAt,
            data.updatedAt
        );
    }

    async getProfileByCandidateId(candidateId: string): Promise<CandidateProfile | null> {
        const data = await prisma.candidateProfile.findUnique({ where: { candidateId } });
        if (!data) return null;
        return new CandidateProfile(
            data.id,
            data.candidateId,
            data.skills,
            data.experience,
            data.education,
            data.birthDate,
            data.cpf,
            data.phone2,
            data.gender,
            data.address,
            data.academicInfo,
            data.professionalInfo,
            data.socialLinks,
            data.portfolioUrl,
            data.aiSummary,
            data.aiExperienceSummary,
            data.aiAcademicSummary,
            data.aiSummaryFingerprint,
            data.profileFingerprint,
            data.createdAt,
            data.updatedAt
        );
    }

    async updateProfile(candidateId: string, profileData: Partial<Omit<CandidateProfile, 'id' | 'candidateId' | 'createdAt' | 'updatedAt'>>): Promise<CandidateProfile> {
        const data = await prisma.candidateProfile.update({
            where: { candidateId },
            data: profileData
        });
        return new CandidateProfile(
            data.id,
            data.candidateId,
            data.skills,
            data.experience,
            data.education,
            data.birthDate,
            data.cpf,
            data.phone2,
            data.gender,
            data.address,
            data.academicInfo,
            data.professionalInfo,
            data.socialLinks,
            data.portfolioUrl,
            data.aiSummary,
            data.aiExperienceSummary,
            data.aiAcademicSummary,
            data.aiSummaryFingerprint,
            data.profileFingerprint,
            data.createdAt,
            data.updatedAt
        );
    }

    async update(id: string, candidateData: Partial<Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Candidate> {
        const data = await prisma.candidate.update({
            where: { id },
            data: candidateData
        });
        return new Candidate(data.id, data.name, data.email, data.phone, data.location, data.passwordHash, data.createdAt, data.updatedAt);
    }
}

