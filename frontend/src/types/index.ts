export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  specialization?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  senderId: string;
  conversationId: string;
  text: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
  sender?: User;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'patient';
  specialization?: string;
  phone?: string;
}

export interface APIError {
  message: string;
  status: number;
}

export interface CreateConversationData {
  participantIds: string[];
}

export interface SendMessageData {
  conversationId: string;
  text: string;
}

export interface SocketMessage {
  conversationId: string;
  message: Message;
}

export interface TypingEvent {
  userId: string;
  conversationId: string;
  isTyping: boolean;
}

export interface ChatState {
  messages: Message[];
  conversations: Conversation[];
  activeConversation: string | null;
  isLoading: boolean;
  typing: Record<string, boolean>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppTheme {
  isDark: boolean;
}