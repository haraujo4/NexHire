"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateRepository = void 0;
const Candidate_1 = require("../../core/entities/Candidate");
const prisma_1 = require("../database/prisma");
class CandidateRepository {
    async findById(id) {
        const data = await prisma_1.prisma.candidate.findUnique({ where: { id } });
        if (!data)
            return null;
        return new Candidate_1.Candidate(data.id, data.name, data.email, data.phone, data.location, data.passwordHash, data.createdAt, data.updatedAt);
    }
    async findByEmail(email) {
        const data = await prisma_1.prisma.candidate.findUnique({ where: { email } });
        if (!data)
            return null;
        return new Candidate_1.Candidate(data.id, data.name, data.email, data.phone, data.location, data.passwordHash, data.createdAt, data.updatedAt);
    }
    async create(candidateData) {
        const data = await prisma_1.prisma.candidate.create({
            data: {
                name: candidateData.name,
                email: candidateData.email,
                phone: candidateData.phone,
                location: candidateData.location,
                passwordHash: candidateData.passwordHash
            }
        });
        return new Candidate_1.Candidate(data.id, data.name, data.email, data.phone, data.location, data.passwordHash, data.createdAt, data.updatedAt);
    }
    async createProfile(profileData) {
        const data = await prisma_1.prisma.candidateProfile.create({
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
        return new Candidate_1.CandidateProfile(data.id, data.candidateId, data.skills, data.experience, data.education, data.birthDate, data.cpf, data.phone2, data.gender, data.address, data.academicInfo, data.professionalInfo, data.socialLinks, data.portfolioUrl, data.aiSummary, data.aiExperienceSummary, data.aiAcademicSummary, data.aiSummaryFingerprint, data.profileFingerprint, data.createdAt, data.updatedAt);
    }
    async getProfileByCandidateId(candidateId) {
        const data = await prisma_1.prisma.candidateProfile.findUnique({ where: { candidateId } });
        if (!data)
            return null;
        return new Candidate_1.CandidateProfile(data.id, data.candidateId, data.skills, data.experience, data.education, data.birthDate, data.cpf, data.phone2, data.gender, data.address, data.academicInfo, data.professionalInfo, data.socialLinks, data.portfolioUrl, data.aiSummary, data.aiExperienceSummary, data.aiAcademicSummary, data.aiSummaryFingerprint, data.profileFingerprint, data.createdAt, data.updatedAt);
    }
    async updateProfile(candidateId, profileData) {
        const data = await prisma_1.prisma.candidateProfile.update({
            where: { candidateId },
            data: profileData
        });
        return new Candidate_1.CandidateProfile(data.id, data.candidateId, data.skills, data.experience, data.education, data.birthDate, data.cpf, data.phone2, data.gender, data.address, data.academicInfo, data.professionalInfo, data.socialLinks, data.portfolioUrl, data.aiSummary, data.aiExperienceSummary, data.aiAcademicSummary, data.aiSummaryFingerprint, data.profileFingerprint, data.createdAt, data.updatedAt);
    }
    async update(id, candidateData) {
        const data = await prisma_1.prisma.candidate.update({
            where: { id },
            data: candidateData
        });
        return new Candidate_1.Candidate(data.id, data.name, data.email, data.phone, data.location, data.passwordHash, data.createdAt, data.updatedAt);
    }
}
exports.CandidateRepository = CandidateRepository;
