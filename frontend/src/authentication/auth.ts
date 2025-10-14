// auth.ts
export const currentUser = {
    name: "Bryan",
    role: "Admin"
};

export function hasRole(requiredRole: string) {
    return currentUser.role === requiredRole;
}