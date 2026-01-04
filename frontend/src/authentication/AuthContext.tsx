// AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type UserDto, type RegisterPayload, type UpdateProfilePayload } from '../services/authApi';


interface User extends UserDto { }

// interface UpdateProfileData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phoneNumber: string;
//     location: string;
//     jobTitle: string;
// }
// interface RegisterData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     phoneNumber: string;
//     jobTitle: string;
//     role: string;
//     companyId: number | null;
//     departmentId: number | null;
//     workplaceId: number | null;
// }


interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterPayload) => Promise<void>;
    logout: () => void;
    updateProfile: (profileData: UpdateProfilePayload) => Promise<void>;
    refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount: check if user is logged in
    useEffect(() => {
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
    }, []);

    // after token set refresh profile
    useEffect(() => {
        if (token && user) {
            refreshUser();
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const loginData = await authApi.login(email, password);

            localStorage.setItem('token', loginData.token);
            localStorage.setItem('user', JSON.stringify(loginData.user));

            setToken(loginData.token);
            setUser(loginData.user);
        } 
        finally {
            setIsLoading(false);
        }
    };

    const register = async (formData: RegisterPayload) => {
        setIsLoading(true);
        try {
            
            const registerData = await authApi.register(formData);

            localStorage.setItem('token', registerData.token);
            localStorage.setItem('user', JSON.stringify(registerData.user));
            setToken(registerData.token);
            setUser(registerData.user);
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

    const refreshUser = async () => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) return;
        try {
            const userData = await authApi.getProfile(storedToken);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error("Failed to refresh userr (authcontext):", error);
        }
    };

    const updateProfile = async (profileData: UpdateProfilePayload) => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            throw new Error('Not authenticated, log in to continue');
        }
        setIsLoading(true);
        
        try {
            const updatedUser = await authApi.updateProfile(storedToken, profileData);
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser));
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