import { logger } from '@/utils/logger';
import { ApiError } from '@/utils/ApiError';
import { LangflowResponse, LangflowResult } from '@/types/langflow';

export class LangflowService {
  private baseUrl: string;
  private flowId: string;
  private apiKey: string;
  private hfToken?: string;
  private requestTimeout: number = 30000;

  constructor() {
    this.baseUrl = process.env.LANGFLOW_BASE_URL || '';
    this.flowId = process.env.FLOW_ID || '';
    this.apiKey = process.env.LANGFLOW_API_KEY || '';
    this.hfToken = process.env.HF_TOKEN;

    if (!this.baseUrl || !this.flowId || !this.apiKey) {
      throw new Error('Missing required Langflow configuration');
    }
  }

  public async sendMessage(message: string, sessionId: string, maxRetries: number = 2): Promise<LangflowResult> {
    const url = `${this.baseUrl}/api/v1/run/${this.flowId}`;
    
    const body = {
      input_value: message,
      output_type: 'chat',
      input_type: 'chat',
      session_id: sessionId,
      tweaks: null
    };

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = 1000 * Math.pow(2, attempt);
          logger.info(`Retrying Langflow request in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            ...(this.hfToken && { 'Authorization': `Bearer ${this.hfToken}` }),
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new ApiError(response.status, `Langflow API error: ${errorText}`);
        }

        const data: LangflowResponse = await response.json();
        const responseText = this.extractResponseText(data);
        
        return {
          response: responseText,
          sessionId: data.session_id || sessionId
        };

      } catch (error) {
        lastError = error as Error;
        
        if (error instanceof ApiError) {
          if (attempt === maxRetries) {
            throw error;
          }
        } else if (error instanceof Error && error.name === 'AbortError') {
          if (attempt === maxRetries) {
            throw new ApiError(408, 'Request timeout');
          }
        } else {
          if (attempt === maxRetries) {
            throw new ApiError(500, 'Network error occurred');
          }
        }

        logger.warn(`Langflow request failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
      }
    }
    
    throw new ApiError(500, `Failed to communicate with Langflow after ${maxRetries + 1} attempts: ${lastError?.message}`);
  }

  private extractResponseText(data: LangflowResponse): string {
    if (!data) {
      throw new ApiError(500, 'No data received from Langflow API');
    }

    const responseText = 
      data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ??
      data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ??
      data?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message;

    if (!responseText) {
      logger.error('Unexpected Langflow response format:', JSON.stringify(data, null, 2));
      throw new ApiError(500, 'Unexpected response format from Langflow API');
    }

    return responseText;
  }
}