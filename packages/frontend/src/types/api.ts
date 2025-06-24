export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: {
    message: string;
    code: number;
    details?: any;
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  responseTime?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  messageId: string;
}