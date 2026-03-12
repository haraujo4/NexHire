export class Job {
    constructor(
        public id: string,
        public companyId: string,
        public title: string,
        public description: string,
        public requirements: string[],
        public salaryRange: string | null,
        public location: string | null,
        public isActive: boolean,
        public isEliminatory: boolean,
        public customForm: any | null,
        public jobFingerprint: string | null,
        public createdAt: Date,
        public updatedAt: Date,
        public _count?: { applications: number }
    ) { }
}

