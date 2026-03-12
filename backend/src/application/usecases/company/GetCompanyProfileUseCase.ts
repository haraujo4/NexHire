import { CompanyProfile } from "../../../core/entities/Company";
import { ICompanyRepository } from "../../../core/interfaces/ICompanyRepository";

export class GetCompanyProfileUseCase {
    constructor(private readonly companyRepository: ICompanyRepository) { }

    async execute(companyId: string): Promise<CompanyProfile | null> {
        return this.companyRepository.getProfile(companyId);
    }
}
