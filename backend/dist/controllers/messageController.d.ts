import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
interface SendMessageRequest extends AuthRequest {
    body: {
        conversationId: string;
        text: string;
    };
}
export declare const listMessages: (req: Request, res: Response) => Promise<void>;
export declare const sendMessage: (req: SendMessageRequest, res: Response) => Promise<void>;
export declare const markRead: (req: AuthRequest, res: Response) => Promise<void>;
export declare const markReadOne: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=messageController.d.ts.map