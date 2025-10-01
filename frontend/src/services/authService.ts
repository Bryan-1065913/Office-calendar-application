const API_URL = "https://localhost:5017"

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

        return await response.json()
    }
}