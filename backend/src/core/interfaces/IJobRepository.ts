import { Job } from "../entities/Job";

export interface IJobRepository {
    findById(id: string): Promise<Job | null>;
    findAll(companyId?: string): Promise<Job[]>;
    create(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job>;
    update(id: string, data: Partial<Omit<Job, 'id' | 'companyId' | 'createdAt'>>): Promise<Job>;
    delete(id: string): Promise<void>;
}
