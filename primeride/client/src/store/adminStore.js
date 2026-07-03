import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple admin email/password — no server required
// Change these to whatever you want
export const ADMIN_EMAIL = 'admin@primeride.pk';
export const ADMIN_PASSWORD = 'PrimeRide2024!';

export const useAdminStore = create(
  persist(
    (set) => ({
      isAdminLoggedIn: false,

      adminLogin: (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ isAdminLoggedIn: true });
          return true;
        }
        return false;
      },

      adminLogout: () => set({ isAdminLoggedIn: false }),
    }),
    {
      name: 'primeride-admin',
    }
  )
);
