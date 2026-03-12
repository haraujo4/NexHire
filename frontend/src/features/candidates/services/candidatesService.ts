import { api } from '../../../shared/api/api';

export const candidatesService = {
    async getProfile(id: string) {
        const response = await api.get(`/company/candidates/${id}/profile`);
        return response.data;
    },
    async summarize(id: string) {
        const response = await api.post(`/company/candidates/${id}/summarize`);
        return response.data;
    },
    async getCandidateSelfProfile() {
        const response = await api.get('/candidate/profile');
        return response.data;
    },
    async updateSelfProfile(data: any) {
        const response = await api.put('/candidate/profile', data);
        return response.data;
    },
    async getCompanyProfile() {
        const response = await api.get('/company/profile');
        return response.data;
    },
    async updateCompanyProfile(data: any) {
        const response = await api.put('/company/profile', data);
        return response.data;
    },
    async extractCV(formData: FormData) {
        const response = await api.post('/candidate/profile/extract-cv', formData);
        return response.data;
    }
};
