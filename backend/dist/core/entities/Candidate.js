"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateProfile = exports.Candidate = void 0;
class Candidate {
    constructor(id, name, email, phone, location, passwordHash, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Candidate = Candidate;
class CandidateProfile {
    constructor(id, candidateId, skills, experience, education, birthDate, cpf, phone2, gender, address, academicInfo, professionalInfo, socialLinks, portfolioUrl, aiSummary, aiExperienceSummary, aiAcademicSummary, aiSummaryFingerprint, profileFingerprint, createdAt, updatedAt) {
        this.id = id;
        this.candidateId = candidateId;
        this.skills = skills;
        this.experience = experience;
        this.education = education;
        this.birthDate = birthDate;
        this.cpf = cpf;
        this.phone2 = phone2;
        this.gender = gender;
        this.address = address;
        this.academicInfo = academicInfo;
        this.professionalInfo = professionalInfo;
        this.socialLinks = socialLinks;
        this.portfolioUrl = portfolioUrl;
        this.aiSummary = aiSummary;
        this.aiExperienceSummary = aiExperienceSummary;
        this.aiAcademicSummary = aiAcademicSummary;
        this.aiSummaryFingerprint = aiSummaryFingerprint;
        this.profileFingerprint = profileFingerprint;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.CandidateProfile = CandidateProfile;
