import { create } from 'zustand';
import { ChatState, Message, Conversation } from '@/types';
import { chatService } from '@/services/chatService';
import { messageService } from '@/services/messageService';
import toast from 'react-hot-toast';

interface ChatStore extends ChatState {
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  addMessage: (message: Message) => void;
  markAsRead: (conversationId: string) => Promise<void>;
  setTyping: (userId: string, isTyping: boolean) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  conversations: [],
  activeConversation: null,
  isLoading: false,
  typing: {},

  fetchConversations: async () => {
    try {
      set({ isLoading: true });
      const conversations = await chatService.getConversations();
      set({ conversations, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('Failed to fetch conversations');
    }
  },

  fetchMessages: async (conversationId: string) => {
    try {
      set({ isLoading: true });
      const messages = await messageService.getMessages(conversationId);
      set({ messages, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('Failed to fetch messages');
    }
  },

  sendMessage: async (conversationId: string, text: string) => {
    try {
      const message = await messageService.sendMessage({ conversationId, text });
      const { messages } = get();
      set({ messages: [...messages, message] });
    } catch (error: any) {
      toast.error('Failed to send message');
    }
  },

  setActiveConversation: (conversationId: string | null) => {
    set({ activeConversation: conversationId, messages: [] });
  },

  addMessage: (message: Message) => {
    const { messages, activeConversation } = get();
    if (message.conversationId === activeConversation) {
      set({ messages: [...messages, message] });
    }
    
    // Update conversation with latest message
    const { conversations } = get();
    const updatedConversations = conversations.map(conv => 
      conv._id === message.conversationId 
        ? { ...conv, lastMessage: message }
        : conv
    );
    set({ conversations: updatedConversations });
  },

  markAsRead: async (conversationId: string) => {
    try {
      await messageService.markAsRead(conversationId);
      
      // Update local state
      const { messages, conversations } = get();
      const updatedMessages = messages.map(msg => 
        msg.conversationId === conversationId ? { ...msg, read: true } : msg
      );
      const updatedConversations = conversations.map(conv =>
        conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
      );
      
      set({ messages: updatedMessages, conversations: updatedConversations });
    } catch (error: any) {
      toast.error('Failed to mark messages as read');
    }
  },

  setTyping: (userId: string, isTyping: boolean) => {
    const { typing } = get();
    set({ typing: { ...typing, [userId]: isTyping } });
  },

  updateMessage: (messageId: string, updates: Partial<Message>) => {
    const { messages } = get();
    const updatedMessages = messages.map(msg => 
      msg._id === messageId ? { ...msg, ...updates } : msg
    );
    set({ messages: updatedMessages });
  },
}));