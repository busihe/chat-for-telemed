import { Request, Response } from 'express';
interface RegisterRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        role: 'admin' | 'doctor' | 'patient';
        specialization?: string;
        phone?: string;
    };
}
interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}
export declare const register: (req: RegisterRequest, res: Response) => Promise<void>;
export declare const login: (req: LoginRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=authController.d.ts.map