export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';

export class Application {
    constructor(
        public id: string,
        public candidateId: string,
        public jobId: string,
        public status: ApplicationStatus,
        public compatibilityScore: number | null,
        public aiAnalysis: string | null,
        public formResponses: any | null,
        public createdAt: Date,
        public updatedAt: Date,
        public job?: any,
        public candidate?: any
    ) { }
}

