import { Candidate, CandidateProfile } from "../entities/Candidate";

export interface ICandidateRepository {
    findById(id: string): Promise<Candidate | null>;
    findByEmail(email: string): Promise<Candidate | null>;
    create(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate>;
    createProfile(profile: Omit<CandidateProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<CandidateProfile>;
    getProfileByCandidateId(candidateId: string): Promise<CandidateProfile | null>;
    updateProfile(candidateId: string, data: Partial<Omit<CandidateProfile, 'id' | 'candidateId' | 'createdAt' | 'updatedAt'>>): Promise<CandidateProfile>;
    update(id: string, data: Partial<Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Candidate>;
}
