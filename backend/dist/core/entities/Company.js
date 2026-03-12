"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyProfile = exports.Company = void 0;
class Company {
    constructor(id, name, email, passwordHash, createdAt, updatedAt, profile) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.profile = profile;
    }
}
exports.Company = Company;
class CompanyProfile {
    constructor(id, companyId, description, website, logoUrl, industry, size, address, socialLinks, createdAt, updatedAt) {
        this.id = id;
        this.companyId = companyId;
        this.description = description;
        this.website = website;
        this.logoUrl = logoUrl;
        this.industry = industry;
        this.size = size;
        this.address = address;
        this.socialLinks = socialLinks;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.CompanyProfile = CompanyProfile;
