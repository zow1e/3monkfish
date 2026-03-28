import { readTinyFishEnv, type TinyFishEnv } from '@petcare/config';

export type TinyFishBrowserProfile = 'lite' | 'stealth';

export interface TinyFishProxyConfig {
  enabled: boolean;
  country_code?: string;
}

export interface TinyFishAutomationRequest {
  url: string;
  goal: string;
  browser_profile: TinyFishBrowserProfile;
  timeout_ms?: number;
  proxy_config?: TinyFishProxyConfig;
}

export interface TinyFishAsyncRunResponse {
  run_id: string | null;
  error?: unknown;
}

export interface TinyFishClientOptions {
  baseUrl?: string;
  env?: TinyFishEnv;
  fetchImpl?: typeof fetch;
}

export class TinyFishClient {
  private readonly baseUrl: string;
  private readonly env: TinyFishEnv;
  private readonly fetchImpl: typeof fetch;

  constructor(options: TinyFishClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'https://agent.tinyfish.ai';
    this.env = options.env ?? readTinyFishEnv();
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async runSync(request: TinyFishAutomationRequest): Promise<unknown> {
    return this.postJson('/v1/automation/run', request);
  }

  async *runSse(request: TinyFishAutomationRequest): AsyncGenerator<string> {
    const response = await this.fetchImpl(`${this.baseUrl}/v1/automation/run-sse`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok || !response.body) {
      throw new Error(`TinyFish SSE request failed with ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const chunk = await reader.read();
      if (chunk.done) {
        return;
      }

      yield decoder.decode(chunk.value, { stream: true });
    }
  }

  async runAsync(request: TinyFishAutomationRequest): Promise<TinyFishAsyncRunResponse> {
    return this.postJson('/v1/automation/run-async', request) as Promise<TinyFishAsyncRunResponse>;
  }

  private async postJson(endpoint: string, body: unknown): Promise<unknown> {
    const response = await this.fetchImpl(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`TinyFish request failed with ${response.status}: ${errorBody}`);
    }

    return response.json();
  }

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.env.TINYFISH_API_KEY,
    };
  }
}
