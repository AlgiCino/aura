// LM Studio exposes an OpenAI-compatible endpoint by default (http://localhost:1234/v1)
export async function lmStudioChat(messages: Array<{role: string; content: string}>, model = 'local-model', baseUrl?: string, apiKey?: string) {
  const url = (baseUrl || (import.meta as any).env?.LMSTUDIO_BASE_URL || process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1').replace(/\/$/, '')
  const key = apiKey || (import.meta as any).env?.LMSTUDIO_API_KEY || process.env.LMSTUDIO_API_KEY
  const res = await fetch(`${url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify({ model, messages })
  })
  if (!res.ok) throw new Error(`LM Studio ${res.status}`)
  const json = await res.json()
  return json?.choices?.[0]?.message?.content || ''
}

