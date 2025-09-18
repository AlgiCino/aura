// Minimal in-browser stub for agent SDK used by AIPlanner

const store = {
  conversations: [],
  listeners: new Map(),
};

function notify(id) {
  const conv = store.conversations.find(c => c.id === id);
  const cb = store.listeners.get(id);
  if (cb) cb(conv || { messages: [] });
}

export const agentSDK = {
  async listConversations({ agent_name }) {
    return store.conversations
      .filter(c => c.agent_name === agent_name)
      .sort((a,b) => new Date(b.updated_date||0) - new Date(a.updated_date||0));
  },
  async createConversation({ agent_name, metadata }) {
    const now = new Date().toISOString();
    const conv = { id: String(Date.now()), agent_name, metadata, messages: [], created_date: now, updated_date: now };
    store.conversations.unshift(conv);
    return conv;
  },
  async updateConversation(id, patch) {
    const idx = store.conversations.findIndex(c => c.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    store.conversations[idx] = {
      ...store.conversations[idx],
      ...patch,
      metadata: { ...(store.conversations[idx].metadata || {}), ...(patch.metadata || {}) },
      updated_date: now,
    };
    notify(id);
    return store.conversations[idx];
  },
  subscribeToConversation(id, cb) {
    store.listeners.set(id, cb);
    return () => store.listeners.delete(id);
  },
  async addMessage(conversation, msg) {
    const conv = store.conversations.find(c => c.id === conversation.id);
    if (!conv) return;
    const now = new Date().toISOString();
    conv.messages.push({ ...msg, created_date: now });
    conv.updated_date = now;
    notify(conv.id);
    // Simulate assistant reply
    if (msg.role === 'user') {
      setTimeout(() => {
        const now2 = new Date().toISOString();
        conv.messages.push({ role: 'assistant', content: 'Acknowledged: ' + msg.content, created_date: now2 });
        conv.updated_date = now2;
        notify(conv.id);
      }, 600);
    }
  }
};
