// lib/middleware/authorizeRoles.ts - Role-based access enforcement
export function authorizeRoles(allowed: string[]) {
  return (user: any) => {
    return user && allowed.includes(user.role);
  };
}
