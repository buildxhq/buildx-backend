// store/useUserStore.ts

import { create } from 'zustand';
import { decodeToken } from '@/lib/auth';

const TOKEN_KEY = 'buildx_token';

type Role = 'gc' | 'sub' | 'ae' | 'admin' | 'supplier' | null;

type PlanTier =
  | 'starter'
  | 'growth'
  | 'unlimited'
  | 'sub_free'
  | 'verified_pro'
  | 'elite_partner'
  | 'professional'
  | 'enterprise'
  | 'supplier_free'
  | 'supplier_pro'
  | null;

type DecodedToken = {
  id: string; // ✅ updated from number to string
  role: Role;
  planTier: string;
};

type UserState = {
  token: string | null;
  role: Role;
  planTier: PlanTier;
  hasHydrated: boolean;
  setToken: (token: string) => void;
  setRole: (role: Role) => void;
  setPlanTier: (tier: PlanTier) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  token: null,
  role: null,
  planTier: null,
  hasHydrated: false,

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    const decoded = decodeToken(token) as DecodedToken;
    set({
      token,
      role: decoded?.role || null,
      planTier: decoded?.planTier as PlanTier || null,
      hasHydrated: true,
    });
  },

  setRole: (role) => set({ role }),
  setPlanTier: (planTier) => set({ planTier }),

  hydrate: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const decoded = decodeToken(token) as DecodedToken;
      if (decoded) {
        set({
          token,
          role: decoded.role || null,
          planTier: decoded.planTier as PlanTier || null,
          hasHydrated: true,
        });
      } else {
        set({ hasHydrated: true });
      }
    } else {
      set({ hasHydrated: true });
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, role: null, planTier: null, hasHydrated: true });
  },
}));

// ✅ Automatically hydrate on client
if (typeof window !== 'undefined') {
  useUserStore.getState().hydrate();
}

