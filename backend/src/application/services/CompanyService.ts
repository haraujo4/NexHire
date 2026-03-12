import { ICompanyService } from "../../core/interfaces/services/ICompanyService";
import { Company, CompanyProfile } from "../../core/entities/Company";
import { RegisterCompanyUseCase } from "../usecases/company/RegisterCompanyUseCase";
import { LoginCompanyUseCase } from "../usecases/company/LoginCompanyUseCase";
import { GetCompanyDashboardStatsUseCase } from "../usecases/company/GetCompanyDashboardStatsUseCase";
import { GetCompanyProfileUseCase } from "../usecases/company/GetCompanyProfileUseCase";
import { UpdateCompanyProfileUseCase } from "../usecases/company/UpdateCompanyProfileUseCase";

export class CompanyService implements ICompanyService {
    constructor(
        private readonly registerUC: RegisterCompanyUseCase,
        private readonly loginUC: LoginCompanyUseCase,
        private readonly getStatsUC: GetCompanyDashboardStatsUseCase,
        private readonly getProfileUC: GetCompanyProfileUseCase,
        private readonly updateProfileUC: UpdateCompanyProfileUseCase
    ) { }

    async register(name: string, email: string, passwordPlain: string): Promise<{ company: Company, token: string }> {
        return this.registerUC.execute(name, email, passwordPlain);
    }

    async login(email: string, passwordPlain: string): Promise<{ company: Company, token: string }> {
        return this.loginUC.execute(email, passwordPlain);
    }

    async getProfile(companyId: string): Promise<CompanyProfile | null> {
        return this.getProfileUC.execute(companyId);
    }

    async updateProfile(companyId: string, profileData: any): Promise<CompanyProfile> {
        return this.updateProfileUC.execute(companyId, profileData);
    }

    async getStats(companyId: string): Promise<any> {
        return this.getStatsUC.execute(companyId);
    }
}
