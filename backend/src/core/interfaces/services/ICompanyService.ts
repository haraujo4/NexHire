import { Company, CompanyProfile } from "../../entities/Company";

export interface ICompanyService {
    register(name: string, email: string, password: string): Promise<{ user: any; token: string }>;
    login(email: string, password: string): Promise<{ user: any; token: string }>;
    getProfile(companyId: string): Promise<CompanyProfile | null>;
    updateProfile(companyId: string, profileData: any): Promise<CompanyProfile>;
    getStats(companyId: string): Promise<any>;
}
