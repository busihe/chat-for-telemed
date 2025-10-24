export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'doctor' | 'patient';
    createdAt: Date;
    updatedAt: Date;
}
export interface Conversation {
    _id: string;
    participants: string[];
    createdAt: Date;
}
export interface Message {
    _id: string;
    senderId: string;
    conversationId: string;
    text: string;
    read: boolean;
    createdAt: Date;
}
export interface JWTPayload {
    id: string;
    role: string;
    name: string;
    iat?: number;
    exp?: number;
}
export interface AuthRequest extends Request {
    user?: JWTPayload;
}
export interface CreateConversationRequest {
    participantIds: string[];
}
export interface SendMessageRequest {
    conversationId: string;
    text: string;
}
export interface SocketMessage {
    conversationId: string;
    message: Message;
}
export interface TypingEvent {
    userId: string;
    isTyping: boolean;
}
//# sourceMappingURL=index.d.ts.map