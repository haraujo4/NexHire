"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompanyProfileUseCase = void 0;
class UpdateCompanyProfileUseCase {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(companyId, profileData) {
        return this.companyRepository.updateProfile(companyId, profileData);
    }
}
exports.UpdateCompanyProfileUseCase = UpdateCompanyProfileUseCase;
