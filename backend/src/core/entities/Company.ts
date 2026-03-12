export class Company {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public passwordHash: string,
        public createdAt: Date,
        public updatedAt: Date,
        public profile?: CompanyProfile | null
    ) { }
}

export class CompanyProfile {
    constructor(
        public id: string,
        public companyId: string,
        public description: string | null,
        public website: string | null,
        public logoUrl: string | null,
        public industry: string | null,
        public size: string | null,
        public address: any | null,
        public socialLinks: any | null,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}
