"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompanyDashboardStatsUseCase = void 0;
const prisma_1 = require("../../../infrastructure/database/prisma");
class GetCompanyDashboardStatsUseCase {
    async execute(companyId) {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        const [activeJobs, totalApplications, statusCounts, avgScore, recentApps, allProfiles] = await Promise.all([
            prisma_1.prisma.job.count({
                where: { companyId, isActive: true }
            }),
            prisma_1.prisma.application.count({
                where: { job: { companyId } }
            }),
            prisma_1.prisma.application.groupBy({
                by: ['status'],
                where: { job: { companyId } },
                _count: true
            }),
            prisma_1.prisma.application.aggregate({
                where: { job: { companyId }, compatibilityScore: { not: null } },
                _avg: { compatibilityScore: true }
            }),
            prisma_1.prisma.application.findMany({
                where: {
                    job: { companyId },
                    createdAt: { gte: fifteenDaysAgo }
                },
                select: { createdAt: true }
            }),
            prisma_1.prisma.candidateProfile.findMany({
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
        statusCounts.forEach((item) => {
            if (item.status in breakdown) {
                const count = typeof item._count === 'number' ? item._count : (item._count?._all || 0);
                breakdown[item.status] = count;
            }
        });
        // Trends (Last 15 days)
        const trendMap = new Map();
        for (let i = 0; i < 15; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            trendMap.set(d.toISOString().split('T')[0], 0);
        }
        recentApps.forEach((app) => {
            const dateStr = app.createdAt.toISOString().split('T')[0];
            if (trendMap.has(dateStr)) {
                trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
            }
        });
        const trends = Array.from(trendMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
        // Skill Distribution
        const skillMap = new Map();
        allProfiles.forEach((p) => {
            p.skills?.forEach((s) => {
                const skill = s.trim().toLowerCase();
                if (skill) {
                    skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
                }
            });
        });
        const skills = Array.from(skillMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
        // Score Distribution
        const scores = await prisma_1.prisma.application.findMany({
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
        const scoreDistribution = ranges.map((r) => ({
            range: r.range,
            count: scores.filter((s) => s.compatibilityScore !== null && s.compatibilityScore >= r.min && s.compatibilityScore <= r.max).length
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
exports.GetCompanyDashboardStatsUseCase = GetCompanyDashboardStatsUseCase;
