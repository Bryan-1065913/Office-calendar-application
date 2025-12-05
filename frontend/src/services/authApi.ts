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

// Api layer -- only http calls
export const  authApi = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                errorData?.detail ||
                "Login failed, try again."
            );
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
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              errorData?.detail ||
              "Registratie mislukt, probeer het later opnieuw."
          );
        }
    
        return response.json();
      },
};