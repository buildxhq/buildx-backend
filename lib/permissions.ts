// /lib/permissions.ts — Centralized Permission Logic

export function canCreateProject(role: string, planTier: string): boolean {
  if (role === 'gc') return true;
  if (role === 'ae') return true;
  if (role === 'sub') return planTier === 'sub_elite_partner';
  return false;
}

export function canInviteSupplier(role: string, planTier: string): boolean {
  return role === 'sub' && planTier === 'sub_elite_partner';
}

export function canAccessAI(role: string, planTier: string): boolean {
  if (['gc', 'ae'].includes(role)) return true;
  if (role === 'sub' && planTier === 'sub_elite_partner') return true;
  return false;
}

export function isAdmin(role: string): boolean {
  return role === 'admin';
}
