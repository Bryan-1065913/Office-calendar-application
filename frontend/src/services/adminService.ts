// src/services/adminService.ts

const API_URL = import.meta.env.VITE_API_BASE || "/api";

export interface User {
    id: number;
    userId: number;          // Beide voor compatibiliteit
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    jobTitle: string;
    location: string;
    role: string;
    createdAt: string;
    updatedAt?: string;
}

// Payload for new user 
export interface CreateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    jobTitle?: string;
    location?: string;
    role: string;
    companyId?: number | null;
    departmentId?: number | null;
    workplaceId?: number | null;
}

// Payload for user update
export interface UpdateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;       // Optioneel - alleen als wachtwoord wijzigt
    phoneNumber?: string;
    jobTitle?: string;
    location?: string;
    role: string;
    companyId?: number | null;
    departmentId?: number | null;
    workplaceId?: number | null;
}

// Stats for dashboard
export interface AdminStats {
    totalUsers: number;
    adminCount: number;
    userCount: number;
    recentUsers: User[];
}


export const adminService = {

    // Get all users
    async getAllUsers(token: string): Promise<User[]> {
        const response = await fetch(`${API_URL}/admin/users`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to fetch users");
        }

        return response.json();

    },

    // Get specific user by id
    async getUserById(token: string, id: number): Promise<User> {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to fetch user");
        }

        return response.json();
    },

    // create a user/admin
    async createUser(token: string, payload: CreateUserPayload): Promise<User> {
        const response = await fetch(`${API_URL}/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to create user");
        }

        return response.json();
    },

    // update a user
    async updateUser(token: string, id: number, payload: UpdateUserPayload): Promise<User> {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to update user");
        }

        return response.json();
    },

    // delete a user
    async deleteUser(token: string, id: number): Promise<void> {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to delete user");
        }

    },

    // Get the admin stats
    async getAdminStats(token: string): Promise<AdminStats> {
        const response = await fetch(`${API_URL}/admin/stats`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to fetch statistics");
        }

        return response.json();
    },

    // get all events 
    async getAllEvents(token: string): Promise<any[]> {
        const response = await fetch(`${API_URL}/events`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to fetch events");
        }

        return response.json();
    },

    // delete an event
    async deleteEvent(token: string, id: number): Promise<void> {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to delete event");
        }
    },
};
