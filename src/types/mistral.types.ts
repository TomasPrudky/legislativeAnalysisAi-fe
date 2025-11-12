<<<<<<< HEAD
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
=======
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
>>>>>>> 0e95aa6d6617eb1ac2e126e8eba9a6dcde1dbc56
}