import { Router } from 'express';
import { auth } from '../middleware/auth';
import { listConversations, createConversation } from '../controllers/conversationController';

const router = Router();

router.get('/', auth, listConversations);
router.post('/', auth, createConversation);

export default router;
