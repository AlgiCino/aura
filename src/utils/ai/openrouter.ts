export async function openRouterChat(messages: Array<{role: string; content: string}>, model = 'openai/gpt-4o-mini', opts: {apiKey?: string} = {}) {
  const apiKey = opts.apiKey || (import.meta as any).env?.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages })
  })
  if (!res.ok) throw new Error(`OpenRouter ${res.status}`)
  const json = await res.json()
  return json?.choices?.[0]?.message?.content || ''
}

