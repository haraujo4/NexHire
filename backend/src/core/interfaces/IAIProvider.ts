export interface AIInput {
    jobDescription: string;
    jobRequirements: string[];
    candidateProfile: {
        skills: string[];
        experience: string;
        education: string;
        academicInfo?: any;
        professionalInfo?: any;
    };
    formResponses?: any;
}

export interface AIResult {
    compatibility_score: number;
    strengths: string[];
    weaknesses: string[];
    recommended_roles: string[];
    incompatible_by_form?: boolean;
}

export interface CVExtractedData {
    name?: string;
    skills: string[];
    experience: string;
    education: string;
    birthDate?: string;
    cpf?: string;
    phone2?: string;
    gender?: string;
    address?: {
        street?: string;
        number?: string;
        complement?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
    academicInfo: Array<{
        institution: string;
        degree: string;
        year: string;
    }>;
    professionalInfo: Array<{
        company: string;
        role: string;
        period: string;
        description: string;
    }>;
    socialLinks: {
        linkedin?: string;
        github?: string;
    };
    portfolioUrl?: string;
}

export interface IAIProvider {
    analyzeCandidate(input: AIInput): Promise<AIResult>;
    extractDataFromCV(text: string): Promise<CVExtractedData>;
    suggestSkills(description: string): Promise<string[]>;
    improveJobDescription(description: string): Promise<string>;
    generateQuestions(description: string, requirements: string[]): Promise<any[]>;
    summarizeProfile(profileData: any): Promise<{
        general: string;
        experience: string;
        academic: string;
    }>;
}

