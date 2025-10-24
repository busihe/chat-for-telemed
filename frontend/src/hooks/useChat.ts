import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '@/stores/chatStore';
import { useAuth } from './useAuth';
import { Message, SocketMessage, TypingEvent } from '@/types';
import { getToken } from '@/utils/auth';

export const useChat = () => {
  const { user, isAuthenticated } = useAuth();
  const socket = useRef<Socket | null>(null);
  const {
    messages,
    conversations,
    activeConversation,
    isLoading,
    typing,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setActiveConversation,
    addMessage,
    markAsRead,
    setTyping,
  } = useChatStore();

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = getToken();
      
      socket.current = io('http://localhost:4000', {
        auth: { token },
        transports: ['websocket'],
      });

      // Socket event listeners
      socket.current.on('connect', () => {
        console.log('Connected to server');
      });

      socket.current.on('receiveMessage', (data: SocketMessage) => {
        addMessage(data.message);
      });

      socket.current.on('typing', (data: TypingEvent) => {
        if (data.userId !== user._id) {
          setTyping(data.userId, data.isTyping);
          
          // Clear typing indicator after 3 seconds
          if (data.isTyping) {
            setTimeout(() => {
              setTyping(data.userId, false);
            }, 3000);
          }
        }
      });

      socket.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [isAuthenticated, user, addMessage, setTyping]);

  // Join room when active conversation changes
  useEffect(() => {
    if (socket.current && activeConversation) {
      socket.current.emit('joinRoom', activeConversation);
      markAsRead(activeConversation);
    }
  }, [activeConversation, markAsRead]);

  const sendSocketMessage = (text: string) => {
    if (socket.current && activeConversation) {
      socket.current.emit('sendMessage', {
        conversationId: activeConversation,
        text,
      });
    }
  };

  const emitTyping = (isTyping: boolean) => {
    if (socket.current && activeConversation && user) {
      socket.current.emit('typing', {
        userId: user._id,
        conversationId: activeConversation,
        isTyping,
      });
    }
  };

  const selectConversation = async (conversationId: string) => {
    setActiveConversation(conversationId);
    await fetchMessages(conversationId);
  };

  return {
    messages,
    conversations,
    activeConversation,
    isLoading,
    typing,
    fetchConversations,
    sendMessage,
    sendSocketMessage,
    selectConversation,
    emitTyping,
    isConnected: socket.current?.connected || false,
  };
};