import { ApiResponse, ChatMessage, ChatResponse } from '../types/api';

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  public async sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    const response = await this.request<ChatResponse>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });

    return response.data;
  }

  public async createSession(): Promise<{ sessionId: string }> {
    const response = await this.request<{ sessionId: string }>('/chat/session', {
      method: 'POST',
    });

    return response.data;
  }

  public async getSessionHistory(sessionId: string): Promise<{ sessionId: string; messages: ChatMessage[] }> {
    const response = await this.request<{ sessionId: string; messages: ChatMessage[] }>(
      `/chat/session/${sessionId}/history`
    );

    return response.data;
  }

  public async healthCheck(): Promise<any> {
    const response = await this.request('/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();