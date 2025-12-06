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

    /* -------------------------
     * WEEK OVERVIEW
     * ------------------------- */
    getWeekWorkStatus: async (startDate: string, userId: number): Promise<WorkStatus[]> => {
        try {
            console.log("🔵 [WEEK] API CALL");
            console.log("➡️ startDate:", startDate);
            console.log("➡️ userId:", userId);

            const response = await api.get(`/workstatus/week`, {
                params: { startDate, userId }
            });

            console.log("🟢 [WEEK] API RESPONSE:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("🔴 [WEEK] API ERROR:", error.response?.data || error);
            throw error;
        }
    },

    /* -------------------------
     * MONTH OVERVIEW
     * ------------------------- */
    getMonthWorkStatus: async (startDate: string, userId: number): Promise<WorkStatus[]> => {
        try {
            console.log("🔵 [MONTH] API CALL");
            console.log("➡️ startDate:", startDate);
            console.log("➡️ userId:", userId);

            const response = await api.get(`/workstatus/month`, {
                params: { startDate, userId }
            });

            console.log("🟢 [MONTH] API RESPONSE:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("🔴 [MONTH] API ERROR:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    /* -------------------------
     * CRUD
     * ------------------------- */
    createWorkStatus: async (request: CreateWorkStatusRequest): Promise<WorkStatus> => {
        console.log("🟡 [CREATE] Sending:", request);
        const response = await api.post('/workstatus', request);
        console.log("🟢 [CREATE] Created:", response.data);
        return response.data;
    },

    updateWorkStatus: async (id: number, request: CreateWorkStatusRequest): Promise<void> => {
        console.log("🟠 [UPDATE] ID:", id, " DATA:", request);
        await api.put(`/workstatus/${id}`, request);
        console.log("🟢 [UPDATE] Done");
    },

    deleteWorkStatus: async (id: number): Promise<void> => {
        console.log("🔴 [DELETE] ID:", id);
        await api.delete(`/workstatus/${id}`);
        console.log("🟢 [DELETE] Done");
    }
};