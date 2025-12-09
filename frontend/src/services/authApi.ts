const API_URL = "http://localhost:5017/api";

export interface UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    jobTitle: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    user: UserDto;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    jobTitle: string;
    role: string;
    companyId: number | null;
    departmentId: number | null;
    workplaceId: number | null;
}

export interface UpdateProfilePayload {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    location: string;
    jobTitle: string;
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

export const authAPi = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || error?.detail || "Login failed, try again");
        }
        return response.json();
    },

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || error?.detail || "Registration failed, try again.");
        }
        return response.json();
    },

    // fetch full profile with token
    async getProfile(token: string): Promise<UserDto> {
        const response = await fetch(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) 
        {
            throw new Error("Failed to fetch profile");
        }
        return response.json();            
    },

    // update profile with bearer token
    async updateProlfe(token: string, payload: UpdateProfilePayload): Promise<UserDto> {
        const response = await fetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok)
        {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to update profile");
        }
        return response.json();
    },
};  