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
    trends: {
        date: string;
        count: number;
    }[];
    skills: {
        name: string;
        count: number;
    }[];
    scoreDistribution: {
        range: string;
        count: number;
    }[];
}

export class GetCompanyDashboardStatsUseCase {
    async execute(companyId: string): Promise<DashboardStats> {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        const [activeJobs, totalApplications, statusCounts, avgScore, recentApps, allProfiles] = await Promise.all([
            prisma.job.count({
                where: { companyId, isActive: true }
            }),
            prisma.application.count({
                where: { job: { companyId } }
            }),
            prisma.application.groupBy({
                by: ['status'],
                where: { job: { companyId } },
                _count: true
            }),
            prisma.application.aggregate({
                where: { job: { companyId }, compatibilityScore: { not: null } },
                _avg: { compatibilityScore: true }
            }),
            prisma.application.findMany({
                where: { 
                    job: { companyId },
                    createdAt: { gte: fifteenDaysAgo }
                },
                select: { createdAt: true }
            }),
            prisma.candidateProfile.findMany({
                where: { 
                    candidate: { applications: { some: { job: { companyId } } } }
                },
                select: { skills: true }
            })
        ]);

        // Status Breakdown
        const breakdown = {
            applied: 0,
            screening: 0,
            interview: 0,
            offer: 0,
            hired: 0,
            rejected: 0
        };

        (statusCounts as any[]).forEach((item: { status: string; _count: any }) => {
            if (item.status in breakdown) {
                const count = typeof item._count === 'number' ? item._count : (item._count?._all || 0);
                (breakdown as any)[item.status] = count;
            }
        });

        // Trends (Last 15 days)
        const trendMap = new Map<string, number>();
        for (let i = 0; i < 15; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            trendMap.set(d.toISOString().split('T')[0], 0);
        }

        recentApps.forEach((app: { createdAt: Date }) => {
            const dateStr = app.createdAt.toISOString().split('T')[0];
            if (trendMap.has(dateStr)) {
                trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
            }
        });

        const trends = Array.from(trendMap.entries())
            .map(([date, count]: [string, number]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Skill Distribution
        const skillMap = new Map<string, number>();
        allProfiles.forEach((p: { skills: string[] | null | undefined }) => {
            p.skills?.forEach((s: string) => {
                const skill = s.trim().toLowerCase();
                if (skill) {
                    skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
                }
            });
        });

        const skills = Array.from(skillMap.entries())
            .map(([name, count]: [string, number]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        // Score Distribution
        const scores = await prisma.application.findMany({
            where: { job: { companyId }, compatibilityScore: { not: null } },
            select: { compatibilityScore: true }
        });

        const ranges = [
            { range: '0-20%', min: 0, max: 20 },
            { range: '21-40%', min: 21, max: 40 },
            { range: '41-60%', min: 41, max: 60 },
            { range: '61-80%', min: 61, max: 80 },
            { range: '81-100%', min: 81, max: 100 }
        ];

        const scoreDistribution = ranges.map((r: { range: string, min: number, max: number }) => ({
            range: r.range,
            count: scores.filter((s: { compatibilityScore: number | null }) => s.compatibilityScore !== null && s.compatibilityScore >= r.min && s.compatibilityScore <= r.max).length
        }));

        return {
            activeJobs,
            totalCandidates: totalApplications,
            avgCompatibility: avgScore._avg.compatibilityScore ? Math.round(avgScore._avg.compatibilityScore) : 0,
            statusBreakdown: breakdown,
            trends,
            skills,
            scoreDistribution
        };
    }
}
