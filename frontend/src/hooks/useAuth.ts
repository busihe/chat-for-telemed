import { useAuthStore } from '@/stores/authStore';
import { LoginCredentials, RegisterData } from '@/types';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    setUser,
    clearAuth,
    updateUser,
  } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials);
  };

  const handleRegister = async (userData: RegisterData) => {
    await register(userData);
  };

  const handleLogout = () => {
    logout();
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    setUser,
    clearAuth,
    updateUser,
    isAdmin: user?.role === 'admin',
    isDoctor: user?.role === 'doctor',
    isPatient: user?.role === 'patient',
  };
};