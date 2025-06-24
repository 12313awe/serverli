import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ChatService } from '@/services/chatService';
import { logger } from '@/utils/logger';
import { ApiError } from '@/utils/ApiError';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  public sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError(400, 'Validation failed', errors.array());
      }

      const { message, sessionId } = req.body;

      logger.info(`Processing chat message for session: ${sessionId || 'new'}`);

      const result = await this.chatService.processMessage(message, sessionId);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Error in sendMessage controller:', error);
      next(error);
    }
  };

  public getSessionHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        throw new ApiError(400, 'Session ID is required');
      }

      // This would typically fetch from a database
      // For now, we'll return a placeholder response
      const history = await this.chatService.getSessionHistory(sessionId);

      res.status(200).json({
        success: true,
        data: {
          sessionId,
          messages: history,
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Error in getSessionHistory controller:', error);
      next(error);
    }
  };

  public createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = await this.chatService.createSession();

      res.status(201).json({
        success: true,
        data: {
          sessionId,
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Error in createSession controller:', error);
      next(error);
    }
  };
}