import { Candidate, CandidateProfile } from "../../entities/Candidate";
import { CVExtractedData } from "../IAIProvider";

export interface ICandidateService {
    register(name: string, email: string, password: string): Promise<{ candidate: Candidate; token: string }>;
    login(email: string, password: string): Promise<{ candidate: Candidate; token: string }>;
    getProfile(candidateId: string): Promise<{ candidate: Candidate; profile: CandidateProfile | null }>;
    getCandidateProfile(candidateId: string): Promise<{ candidate: Candidate; profile: CandidateProfile | null }>;
    updateProfile(candidateId: string, profileData: any): Promise<CandidateProfile>;
    summarizeProfile(candidateId: string): Promise<CandidateProfile>;
    extractCVData(fileBuffer: Buffer, mimetype: string): Promise<CVExtractedData>;
}
