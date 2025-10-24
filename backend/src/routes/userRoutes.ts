import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth';
import { listUsers } from '../controllers/userController';

const router = Router();

router.get('/', auth, requireRole(['admin']), listUsers);

export default router;
