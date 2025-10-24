import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
interface CreateConversationRequest extends AuthRequest {
    body: {
        participantIds: string[];
    };
}
export declare const listConversations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createConversation: (req: CreateConversationRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=conversationController.d.ts.map