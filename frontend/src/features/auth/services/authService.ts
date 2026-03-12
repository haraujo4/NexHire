import { api } from '../../../shared/api/api';

export const authService = {
    async companyLogin(credentials: any) {
        const response = await api.post('/company/login', credentials);
        return response.data;
    },
    async companyRegister(data: any) {
        const response = await api.post('/company/register', data);
        return response.data;
    },
    async candidateLogin(credentials: any) {
        const response = await api.post('/candidate/login', credentials);
        return response.data;
    },
    async candidateRegister(data: any) {
        const response = await api.post('/candidate/register', data);
        return response.data;
    }
};
