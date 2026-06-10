export interface ProviderConfig {
  id: string
  name: string
  type: 'ollama' | 'lm_studio' | 'llama_cpp' | 'openai' | 'custom'
  base_url: string
  api_key_encrypted: string
  default_model: string
  embedding_model?: string
  timeout_seconds: number
  max_retries: number
  streaming: boolean
  privacy_route: string
  is_active: boolean
  last_tested_at?: string
  connection_status?: string
}

export interface ProviderMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ProviderRequest {
  messages: ProviderMessage[]
  model: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export interface StreamChunk {
  delta: string
  done: boolean
}
