import { create } from 'zustand';
import { api } from '../services/api';

export interface Job {
    id: string;
    title: string;
    description: string;
    location: string | null;
    salaryRange: string | null;
    isActive: boolean;
    createdAt: string;
}

interface JobState {
    jobs: Job[];
    currentJob: Job | null;
    loading: boolean;
    error: string | null;
    fetchJobs: (companyId?: string) => Promise<void>;
    createJob: (jobData: any) => Promise<void>;
}

export const useJobStore = create<JobState>((set) => ({
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
    fetchJobs: async (companyId?: string) => {
        set({ loading: true, error: null });
        try {
            const url = companyId ? `/company/jobs` : `/public/jobs`;
            const response = await api.get(url);
            set({ jobs: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createJob: async (jobData: any) => {
        set({ loading: true, error: null });
        try {
            await api.post('/company/jobs', jobData);
            set({ loading: false });
            // Re-fetch could be called here or handled in the component
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    }
}));
