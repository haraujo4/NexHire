import { api } from '../../../shared/api/api';

export const dashboardService = {
    async getStats() {
        const response = await api.get('/company/stats');
        return response.data;
    }
};
