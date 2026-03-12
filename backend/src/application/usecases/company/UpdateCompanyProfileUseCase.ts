import { CompanyProfile } from "../../../core/entities/Company";
import { ICompanyRepository } from "../../../core/interfaces/ICompanyRepository";

export class UpdateCompanyProfileUseCase {
    constructor(private readonly companyRepository: ICompanyRepository) { }

    async execute(companyId: string, profileData: Partial<Omit<CompanyProfile, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>>): Promise<CompanyProfile> {
        return this.companyRepository.updateProfile(companyId, profileData);
    }
}
