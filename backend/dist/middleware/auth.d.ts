import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../types';
export interface AuthRequest extends Request {
    user?: JWTPayload;
}
export declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireRole: (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map