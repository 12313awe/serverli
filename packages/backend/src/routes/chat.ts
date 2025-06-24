import { Router } from 'express';
import { body, param } from 'express-validator';
import { ChatController } from '@/controllers/chatController';

const router = Router();
const chatController = new ChatController();

// Validation middleware
const messageValidation = [
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5000 characters'),
  body('sessionId')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Session ID must be between 1 and 100 characters'),
];

const sessionIdValidation = [
  param('sessionId')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Session ID must be between 1 and 100 characters'),
];

// Routes
router.post('/message', messageValidation, chatController.sendMessage);
router.get('/session/:sessionId/history', sessionIdValidation, chatController.getSessionHistory);
router.post('/session', chatController.createSession);

export default router;