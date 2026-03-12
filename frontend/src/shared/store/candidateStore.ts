import { create } from 'zustand';
import { api } from '../api/api';

interface CandidateState {
    profile: any | null;
    applications: any[];
    loading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    fetchApplications: () => Promise<void>;
    applyForJob: (jobId: string) => Promise<void>;
}

export const useCandidateStore = create<CandidateState>((set) => ({
    profile: null,
    applications: [],
    loading: false,
    error: null,

    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/candidate/profile');
            set({ profile: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchApplications: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/candidate/applications');
            set({ applications: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    applyForJob: async (jobId) => {
        set({ loading: true, error: null });
        try {
            await api.post('/candidate/apply', { jobId });
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    }
}));
