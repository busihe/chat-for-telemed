import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppTheme } from '@/types';

interface ThemeStore extends AppTheme {
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: false,

      toggleTheme: () => {
        const { isDark } = get();
        const newTheme = !isDark;
        
        if (newTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        set({ isDark: newTheme });
      },

      setTheme: (isDark: boolean) => {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        set({ isDark });
      },
    }),
    {
      name: 'theme-store',
      onRehydrateStorage: () => (state) => {
        if (state?.isDark) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);