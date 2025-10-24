import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, RegisterData } from '@/types';
import { authService } from '@/services/authService';
import { setToken, removeToken, setStoredUser } from '@/utils/auth';
import toast from 'react-hot-toast';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });
          const response = await authService.login(credentials);
          
          setToken(response.token);
          setStoredUser(response.user);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('Login successful!');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true });
          const response = await authService.register(userData);
          
          setToken(response.token);
          setStoredUser(response.user);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('Registration successful!');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        removeToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success('Logged out successfully');
      },

      setUser: (user: User) => {
        setStoredUser(user);
        set({ user, isAuthenticated: true });
      },

      clearAuth: () => {
        removeToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          setStoredUser(updatedUser);
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);