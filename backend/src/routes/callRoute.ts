import express from 'express';
import { auth } from '../middleware/auth';
import {
  createCall,
  updateCallStatus,
  getMyCalls,
  getCallById,
} from '../controllers/callcontroller';

const router = express.Router();

// Protect all call routes with auth middleware
router.use(auth);

router.post('/', createCall);
router.patch('/:id/status', updateCallStatus);
router.get('/', getMyCalls);
router.get('/:id', getCallById);

export default router;
