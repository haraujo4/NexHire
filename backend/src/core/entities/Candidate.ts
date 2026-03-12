export class Candidate {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public phone: string | null,
        public location: string | null,
        public passwordHash: string,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}

export class CandidateProfile {
    constructor(
        public id: string,
        public candidateId: string,
        public skills: string[],
        public experience: string,
        public education: string,
        public birthDate: string | null,
        public cpf: string | null,
        public phone2: string | null,
        public gender: string | null,
        public address: any | null,
        public academicInfo: any | null,
        public professionalInfo: any | null,
        public socialLinks: any | null,
        public portfolioUrl: string | null,
        public aiSummary: string | null,
        public aiExperienceSummary: string | null,
        public aiAcademicSummary: string | null,
        public aiSummaryFingerprint: string | null,
        public profileFingerprint: string | null,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}

