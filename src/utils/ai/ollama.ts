export async function ollamaChat(messages: Array<{role: string; content: string}>, model = 'llama3.1', baseUrl?: string) {
  const url = (baseUrl || (import.meta as any).env?.OLLAMA_BASE_URL || process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '')
  const res = await fetch(`${url}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false })
  })
  if (!res.ok) throw new Error(`Ollama ${res.status}`)
  const json = await res.json()
  return json?.message?.content || ''
}

