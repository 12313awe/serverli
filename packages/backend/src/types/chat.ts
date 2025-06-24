export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  responseTime?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  messageId: string;
}

export interface SessionData {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}