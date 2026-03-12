import { api } from '../../../shared/api/api';

export const jobsService = {
    async list() {
        const response = await api.get('/company/jobs');
        return response.data;
    },
    async getById(id: string) {
        const response = await api.get(`/company/jobs/${id}`);
        return response.data;
    },
    async create(data: any) {
        const response = await api.post('/company/jobs', data);
        return response.data;
    },
    async update(id: string, data: any) {
        const response = await api.put(`/company/jobs/${id}`, data);
        return response.data;
    },
    async delete(id: string) {
        const response = await api.delete(`/company/jobs/${id}`);
        return response.data;
    },
    async listCandidateJobs() {
        const response = await api.get('/public/jobs');
        return response.data;
    },
    async improveDescription(description: string) {
        const response = await api.post('/company/jobs/assist/improve-description', { description });
        return response.data;
    },
    async suggestSkills(description: string) {
        const response = await api.post('/company/jobs/assist/skills', { description });
        return response.data;
    },
    async generateQuestions(description: string, requirements: string[]) {
        const response = await api.post('/company/jobs/assist/questions', { description, requirements });
        return response.data;
    }
};
