"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompanyProfileUseCase = void 0;
class GetCompanyProfileUseCase {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(companyId) {
        return this.companyRepository.getProfile(companyId);
    }
}
exports.GetCompanyProfileUseCase = GetCompanyProfileUseCase;
