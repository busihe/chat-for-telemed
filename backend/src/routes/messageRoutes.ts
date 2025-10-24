import { Router } from 'express';
import { auth } from '../middleware/auth';
import { listMessages, sendMessage, markRead, markReadOne } from '../controllers/messageController';

const router = Router();

// List all messages in a conversation
router.get('/:conversationId', auth, listMessages);

// Send a new message
router.post('/', auth, sendMessage);

// Mark all messages in a conversation as read
router.post('/read/:conversationId', auth, markRead);

// Mark a single message as read (with messageId)
router.post('/read-one/:conversationId/:messageId', auth, markReadOne);

// Mark the last message or all messages without specifying messageId
router.post('/read-one/:conversationId', auth, markReadOne);

export default router;
