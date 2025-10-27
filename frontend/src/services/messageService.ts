import { apiClient } from './api';
import { Message, SendMessageData } from '@/types';

export const messageService = {
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await apiClient.get<{ messages: Message[] }>(`/messages/${conversationId}`);
    return response?.data
  },

  async sendMessage(data: SendMessageData): Promise<Message> {
    const response = await apiClient.post<{ message: Message }>('/messages', data);
    return response.data.message;
  },

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.post(`/messages/read/${conversationId}`);
  },

  async deleteMessage(messageId: string): Promise<void> {
    await apiClient.delete(`/messages/${messageId}`);
  },
};