const API_URL = "http://localhost:5017/api"

export interface UserDto {
    id: number
    email: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber: string
    jobTitle: string
    role: string
}

export interface LoginResponse {
    token: string
    user: UserDto
}

export interface RegisterResponse {
    token: string
    user: UserDto
}

export const authService = {
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("Failed to login")
        }

        const data = await response.json()

        // Save token and user
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        return data
    },

    register: async (registerData: {
        firstName: string
        lastName: string
        email: string
        password: string
        phoneNumber: string
        jobTitle: string
        role: string
        companyId: number
        departmentId: number
        workplaceId: number
    }) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerData)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Registration failed" }))
            throw new Error(error.message || "Registration failed")
        }
        
        const data = await response.json()
        
        // Save token and user
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        return data
    },

      // LOGOUT
      logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    },

    // Get current user
    getCurrentUser: (): UserDto | null => {
        const userStr = localStorage.getItem("user")
        return userStr ? JSON.parse(userStr) : null
    },

    // Check if authenticated
    isAuthenticated: (): boolean => {
        return localStorage.getItem("token") !== null
    }
}