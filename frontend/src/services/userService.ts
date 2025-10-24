import { apiClient } from './api';
import { User } from '@/types';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<{ users: User[] }>('/users');
    return response.data.users;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`/users/${id}`);
    return response.data.user;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<{ user: User }>('/users/profile', userData);
    return response.data.user;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};