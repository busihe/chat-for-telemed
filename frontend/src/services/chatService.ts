import { apiClient } from './api';
import { Conversation, CreateConversationData } from '@/types';

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<{ conversations: Conversation[] }>('/conversations');
    return response.data.conversations;
  },

  async createConversation(data: CreateConversationData): Promise<Conversation> {
    const response = await apiClient.post<{ conversation: Conversation }>('/conversations', data);
    return response.data.conversation;
  },

  async getConversationById(id: string): Promise<Conversation> {
    const response = await apiClient.get<{ conversation: Conversation }>(`/conversations/${id}`);
    return response.data.conversation;
  },

  async deleteConversation(id: string): Promise<void> {
    await apiClient.delete(`/conversations/${id}`);
  },
};