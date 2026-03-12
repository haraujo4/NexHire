"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompanyDashboardStatsUseCase = void 0;
const prisma_1 = require("../../../infrastructure/database/prisma");
class GetCompanyDashboardStatsUseCase {
    async execute(companyId) {
        const [activeJobs, totalApplications, statusCounts, avgScore] = await Promise.all([
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
            })
        ]);
        const breakdown = {
            applied: 0,
            interviewing: 0,
            hired: 0,
            rejected: 0
        };
        statusCounts.forEach((item) => {
            if (item.status in breakdown) {
                breakdown[item.status] = item._count;
            }
        });
        return {
            activeJobs,
            totalCandidates: totalApplications,
            avgCompatibility: avgScore._avg.compatibilityScore ? Math.round(avgScore._avg.compatibilityScore) : 0,
            statusBreakdown: breakdown
        };
    }
}
exports.GetCompanyDashboardStatsUseCase = GetCompanyDashboardStatsUseCase;
