import { Company, CompanyProfile } from "../entities/Company";

export interface ICompanyRepository {
    findById(id: string): Promise<Company | null>;
    findByEmail(email: string): Promise<Company | null>;
    create(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company>;
    getProfile(companyId: string): Promise<CompanyProfile | null>;
    updateProfile(companyId: string, profileData: Partial<Omit<CompanyProfile, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>>): Promise<CompanyProfile>;
}
