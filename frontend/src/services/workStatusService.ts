// src/services/workStatusService.ts
import api from './api';

export interface WorkStatus {
    id: number;
    userId: number;
    date: string;
    status: 'office' | 'home' | 'vacation' | 'sick' | 'business_trip' | 'other';
    note?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkStatusRequest {
    userId: number;
    date: string;
    status: string;
    note?: string;
}

export const workStatusService = {
    getWeekWorkStatus: async (startDate: string, userId: number): Promise<WorkStatus[]> => {
        try {
            console.log('📞 Calling API with:', { startDate, userId });

            const response = await api.get(`/workstatus/week`, {
                params: { startDate, userId }
            });

            console.log('✅ API Response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ API Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    createWorkStatus: async (request: CreateWorkStatusRequest): Promise<WorkStatus> => {
        const response = await api.post('/workstatus', request);
        return response.data;
    },

    updateWorkStatus: async (id: number, request: CreateWorkStatusRequest): Promise<void> => {
        await api.put(`/workstatus/${id}`, request);
    },

    deleteWorkStatus: async (id: number): Promise<void> => {
        await api.delete(`/workstatus/${id}`);
    }
};