export interface MyChatRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MyChatResponse  {
  response: string;
  model: string;
  tokensUsed: number;
}

export interface MyReasoningResponse {
  answer: string;
  reasoning: string;
  model: string;
}

export type AiResponse = MyChatResponse | MyReasoningResponse;

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}