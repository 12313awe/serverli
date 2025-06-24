export interface LangflowResponse {
  outputs?: Array<{
    outputs?: Array<{
      results?: { message?: { text?: string } };
      outputs?: { message?: { message?: string } };
      messages?: Array<{ message?: string }>;
    }>;
  }>;
  session_id?: string;
}

export interface LangflowResult {
  response: string;
  sessionId: string;
}