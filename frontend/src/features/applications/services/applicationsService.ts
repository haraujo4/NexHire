import { api } from '../../../shared/api/api';

export const applicationsService = {
    async listForJob(jobId: string) {
        const response = await api.get(`/company/jobs/${jobId}/applications`);
        return response.data;
    },
    async listAll() {
        const response = await api.get('/company/candidates');
        return response.data;
    },
    async updateStatus(id: string, status: string) {
        const response = await api.patch(`/company/applications/${id}/status`, { status });
        return response.data;
    },
    async evaluate(id: string) {
        const response = await api.post(`/company/applications/${id}/evaluate`);
        return response.data;
    },
    async listCandidateApplications() {
        const response = await api.get('/candidate/applications');
        return response.data;
    },
    async simulate(data: { jobId: string, formResponses: any }) {
        const response = await api.post('/candidate/simulate', data);
        return response.data;
    },
    async apply(data: { jobId: string, formResponses: any }) {
        const response = await api.post('/candidate/apply', data);
        return response.data;
    }
};
