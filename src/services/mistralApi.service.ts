import type { MyChatRequest, MyChatResponse, MyReasoningResponse } from '../types/mistral.types';

const API_BASE_URL = 'http://localhost:8080/api/ai';

export class MistralApiService {
  
  static async chat(request: MyChatRequest): Promise<MyChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async reasoning(request: MyChatRequest): Promise<MyReasoningResponse> {
    const response = await fetch(`${API_BASE_URL}/reasoning`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async simpleTest(message: string): Promise<{ message: string; response: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/test?message=${encodeURIComponent(message)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async healthCheck(): Promise<{ status: string; service: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}