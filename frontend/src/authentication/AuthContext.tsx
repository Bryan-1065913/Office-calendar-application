// AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    userId: number;
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

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (profileData: UpdateProfileData) => Promise<void>;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
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

interface UpdateProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    location: string;
    jobTitle: string;
}

const API_URL = "http://localhost:5017/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Bij mount: check of user nog ingelogd is
    useEffect(() => {
        const checkAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // Na login: haal volledige profiel op
    useEffect(() => {
        if (token && user) {
            refreshUser();
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message ||
                    errorData?.detail ||
                    'Login mislukt, controleer je gegevens.'
                );
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            setToken(data.token);
            setUser(data);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (formData: RegisterData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message ||
                    errorData?.detail ||
                    'Registratie mislukt, probeer het later opnieuw.'
                );
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // Haal complete user profile op
    const refreshUser = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) return;

        try {
            const response = await fetch(`${API_URL}/profile`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const userData = await response.json();

            // Update both state and localStorage
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    // Update profiel
    const updateProfile = async (profileData: UpdateProfileData) => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            throw new Error('Not authenticated');
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`,
                },
                body: JSON.stringify({
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    email: profileData.email,
                    phoneNumber: profileData.phoneNumber,
                    location: profileData.location,
                    jobTitle: profileData.jobTitle,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message ||
                    'Failed to update profile'
                );
            }

            const result = await response.json();

            // Update user met de response van de API (bevat nu updatedAt)
            if (result.user) {
                setUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
            } else {
                // Fallback: refresh user data
                await refreshUser();
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token && !!user,
                login,
                register,
                logout,
                updateProfile,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};