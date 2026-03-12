import { prisma } from "../../../infrastructure/database/prisma";

export interface DashboardStats {
    activeJobs: number;
    totalCandidates: number;
    avgCompatibility: number;
    statusBreakdown: {
        applied: number;
        screening: number;
        interview: number;
        offer: number;
        hired: number;
        rejected: number;
    };
    trends: { date: string; count: number; }[];
    skills: { name: string; count: number; }[];
    scoreDistribution: { range: string; count: number; }[];
}

export class GetCompanyDashboardStatsUseCase {
    async execute(companyId: string): Promise<DashboardStats> {
        return {
            activeJobs: 0,
            totalCandidates: 0,
            avgCompatibility: 0,
            statusBreakdown: {
                applied: 0,
                screening: 0,
                interview: 0,
                offer: 0,
                hired: 0,
                rejected: 0
            },
            trends: [],
            skills: [],
            scoreDistribution: []
        };
    }
}
