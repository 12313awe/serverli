import { LangflowService } from '@/services/langflowService';
import { logger } from '@/utils/logger';
import { ApiError } from '@/utils/ApiError';
import { ChatMessage, ChatResponse, SessionData } from '@/types/chat';

export class ChatService {
  private langflowService: LangflowService;
  private sessions: Map<string, SessionData> = new Map();

  constructor() {
    this.langflowService = new LangflowService();
  }

  public async processMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    try {
      if (!message || message.trim().length === 0) {
        throw new ApiError(400, 'Message cannot be empty');
      }

      // Generate session ID if not provided
      const currentSessionId = sessionId || this.generateSessionId();

      // Get or create session
      let session = this.sessions.get(currentSessionId);
      if (!session) {
        session = {
          id: currentSessionId,
          messages: [],
          createdAt: new Date(),
          lastActivity: new Date(),
        };
        this.sessions.set(currentSessionId, session);
      }

      // Update last activity
      session.lastActivity = new Date();

      // Add user message to session
      const userMessage: ChatMessage = {
        id: this.generateMessageId(),
        content: message,
        role: 'user',
        timestamp: new Date(),
      };
      session.messages.push(userMessage);

      logger.info(`Processing message for session ${currentSessionId}: ${message.substring(0, 100)}...`);

      // Send to Langflow
      const langflowResponse = await this.langflowService.sendMessage(message, currentSessionId);

      // Add assistant response to session
      const assistantMessage: ChatMessage = {
        id: this.generateMessageId(),
        content: langflowResponse.response,
        role: 'assistant',
        timestamp: new Date(),
      };
      session.messages.push(assistantMessage);

      // Clean up old sessions (keep only last 100 sessions)
      this.cleanupSessions();

      return {
        response: langflowResponse.response,
        sessionId: currentSessionId,
        messageId: assistantMessage.id,
      };

    } catch (error) {
      logger.error('Error in ChatService.processMessage:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Failed to process message', error);
    }
  }

  public async getSessionHistory(sessionId: string): Promise<ChatMessage[]> {
    const session = this.sessions.get(sessionId);
    return session ? session.messages : [];
  }

  public async createSession(): Promise<string> {
    const sessionId = this.generateSessionId();
    const session: SessionData = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    
    this.sessions.set(sessionId, session);
    logger.info(`Created new session: ${sessionId}`);
    
    return sessionId;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private cleanupSessions(): void {
    if (this.sessions.size > 100) {
      // Sort sessions by last activity and keep only the most recent 100
      const sortedSessions = Array.from(this.sessions.entries())
        .sort(([, a], [, b]) => b.lastActivity.getTime() - a.lastActivity.getTime())
        .slice(0, 100);

      this.sessions.clear();
      sortedSessions.forEach(([id, session]) => {
        this.sessions.set(id, session);
      });

      logger.info('Cleaned up old sessions, keeping 100 most recent');
    }
  }
}