/**
 * AI Providers Configuration (revamped)
 *
 * أهداف التعديل:
 * 1) اعتماد مزوّدين سحابيَيْن فقط في البيئات السحابية: OpenRouter أو Gemini.
 * 2) دعم مزوّدين محلييْن على الجهاز: Ollama و LM Studio، مع اكتشاف/مزامنة الموديل النشط يدويًا فقط (بدون spam في الـ console).
 * 3) الاقتصار في OpenRouter على الموديلات المجانية (يُجلب ذلك ديناميكيًا عبر API عندما يفتح المستخدم صفحة الإعدادات).
 * 4) توفير دوال مساعدة موحّدة لاختيار المزوّد الافتراضي والموديل الافتراضي حسب البيئة ومفاتيح الـ API.
 * 5) كتابة آمنة للمتصفّح (تفادي أخطاء SSR) وتقليل الاعتماد على window مباشرة.
 */

// ============== أدوات مساعدة عامة آمنة للمتصفح ==============
const hasWindow = typeof window !== 'undefined';
const safeLocation = hasWindow ? window.location : { hostname: '', origin: '' };
const ORIGIN = safeLocation.origin || 'https://app.local';

/**
 * كشف بيئة التشغيل (تقريبي):
 * - cloud: عند التشغيل على نطاقات معروفة للسحابة أو أي نطاق عام غير localhost.
 * - local: عند التشغيل على localhost/127.0.0.1 أو بيئات dev.
 */
const CLOUD_HOST_PATTERNS = [
  'vercel.app',
  'netlify.app',
  'onrender.com',
  'fly.dev',
  'railway.app',
  'pages.dev',
  'cloudflarepages.com',
  'github.dev',
  'gitpod.io',
  'repl.co',
  'replit.dev'
];

export function isLocalhostHost(hostname = safeLocation.hostname) {
  if (!hostname) return false;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local') ||
    hostname.startsWith('localhost:') ||
    hostname.startsWith('127.0.0.1:')
  );
}

export function isCloudEnv(hostname = safeLocation.hostname) {
  if (!hostname) return true; // احتياط: اعتبرها سحابية إذا لم نعرف
  if (isLocalhostHost(hostname)) return false;
  return CLOUD_HOST_PATTERNS.some((p) => hostname.includes(p));
}

// ============== إدارة مفاتيح الـ API (يدوي فقط من Provider Settings) ==============
export function getUserApiKey(provider) {
  if (!hasWindow) return null;
  return localStorage.getItem(`ai_key_${provider}`) || null;
}

export function setUserApiKey(provider, key) {
  if (!hasWindow) return;
  if (key) {
    localStorage.setItem(`ai_key_${provider}`, key);
  } else {
    localStorage.removeItem(`ai_key_${provider}`);
  }
}

// ============== تعريفات المزوّدين ==============

/**
 * ملاحظة مهمّة حول OpenRouter والموديلات المجانية:
 * سنُبقي مصفوفة models فارغة هنا. عند فتح شاشة مزوّد OpenRouter في الواجهة،
 * استدعِ الدالة fetchOpenRouterModels(apiKey, { freeOnly: true }) لجلب القائمة الحقيقية
 * وتعبئتها في واجهة الاختيار. هذا يتجنّب وضع IDs قد تتغيّر أو تختلف تسمياتها.
 * سنضبط defaultModel لقيمة آمنة شائعة (DeepSeek Chat) في حال اختار المستخدم دون تحميل القائمة.
 */

export const AI_PROVIDERS = {
  // ===================== OpenRouter (Cloud) =====================
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Cloud)',
    description:
      'مزود سحابي يوفّر الوصول لعدة موديلات عبر API واحد. نوصي به عند التشغيل في السحابة.',
    baseURL: 'https://openrouter.ai/api/v1/chat/completions',
    requiresAuth: true,
    headers: {
      // لا نحقن Authorization هنا. aiClient هو المسؤول عن ذلك.
      'HTTP-Referer': ORIGIN,
      'X-Title': 'Aura Project Manager'
    },
    // موديل افتراضي احتياطي (قد يتغير توفره؛ الغرض منه عدم كسر الاستدعاء لو نسي المستخدم التحميل)
    // يُفضّل دوما جلب القائمة الحقيقية بالمجاني عبر fetchOpenRouterModels
    defaultModel: 'deepseek/deepseek-chat',
    models: [], // تُملأ ديناميكيًا من API عندما يفتح المستخدم الإعدادات
    features: ['cloud', 'dynamic-models', 'free-filter']
  },

  // ======================= Gemini (Cloud) =======================
  /**
   * تنبيه: Gemini يستخدم واجهة generateContent وليس chat/completions.
   * تأكد أن aiClient يدعم adapter:"gemini" أو تحويل الرسائل قبل الإرسال.
   */
  gemini: {
    id: 'gemini',
    name: 'Google Gemini (Cloud)',
    description: 'مزود Google الرسمي. مناسب عندما يتوفر مفتاح Gemini لديك.',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    // نقطة النداء الفعلية للصيغة الحوارية:
    chatEndpoint: (modelId) => `models/${modelId}:generateContent`,
    requiresAuth: true,
    headers: {},
    // موديلات مقترحة شائعة (مجانية ضمن حدود الخطة المجانية لدى جوجل)
    defaultModel: 'gemini-1.5-flash',
    models: [
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'سريع مع جودة جيدة وحد مجاني معقول',
        contextLength: 1000000,
        pricing: { input: 0, output: 0 },
        category: 'general',
        recommended: true
      },
      {
        id: 'gemini-1.5-flash-8b',
        name: 'Gemini 1.5 Flash 8B',
        description: 'نسخة أخف وأرخص (حد مجاني)',
        contextLength: 1000000,
        pricing: { input: 0, output: 0 },
        category: 'general',
        recommended: true
      }
    ],
    features: ['cloud', 'native-api']
  },

  // ======================= Ollama (Local) =======================
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local)',
    description: 'تشغيل موديلات LLM محليًا على جهازك.',
    baseURL: 'http://127.0.0.1:11434/v1/chat/completions',
    requiresAuth: false,
    headers: {},
    defaultModel: 'llama3.2:3b-instruct',
    supportedUrls: [
      'http://127.0.0.1:11434/v1/chat/completions',
      'http://localhost:11434/v1/chat/completions'
    ],
    features: ['local', 'manual-detection', 'free'],
    models: [
      {
        id: 'llama3.2:3b-instruct',
        name: 'Llama 3.2 3B Instruct',
        description: 'موديل محلي خفيف جيد للمحادثة',
        contextLength: 131072,
        pricing: { input: 0, output: 0 },
        category: 'chat',
        recommended: true
      },
      {
        id: 'llama3.2:3b',
        name: 'Llama 3.2 3B',
        description: 'نسخة عامة متوازنة',
        contextLength: 131072,
        pricing: { input: 0, output: 0 },
        category: 'general',
        recommended: false
      }
    ]
  },

  // ===================== LM Studio (Local) =====================
  lmstudio: {
    id: 'lmstudio',
    name: 'LM Studio (Local)',
    description: 'تشغيل موديل محلي عبر واجهة LM Studio.',
    baseURL: 'http://127.0.0.1:1234/v1/chat/completions',
    requiresAuth: false,
    headers: {},
    defaultModel: 'local-model',
    supportedUrls: [
      'http://127.0.0.1:1234/v1/chat/completions',
      'http://localhost:1234/v1/chat/completions'
    ],
    features: ['local', 'manual-detection', 'free', 'gui-management'],
    models: [
      {
        id: 'local-model',
        name: 'Local Model (LM Studio)',
        description: 'الموديل المحمّل حاليًا داخل LM Studio',
        contextLength: 4096,
        pricing: { input: 0, output: 0 },
        category: 'local',
        recommended: true
      }
    ]
  }
};

// ============== دوال مساعدة حول المزوّدين والموديلات ==============
export function getProviderConfig(provider) {
  return AI_PROVIDERS[provider] || null;
}

export function getProviderModels(provider) {
  return AI_PROVIDERS[provider]?.models || [];
}

export function getModelInfo(provider, modelId) {
  const models = getProviderModels(provider);
  return models.find((m) => m.id === modelId) || null;
}

export function getProviderFeatures(provider) {
  return AI_PROVIDERS[provider]?.features || [];
}

export function isLocalProvider(provider) {
  const cfg = getProviderConfig(provider);
  if (!cfg) return false;
  return !cfg.requiresAuth && getProviderFeatures(provider).includes('local');
}

export function getProvidersList() {
  return Object.keys(AI_PROVIDERS).map((id) => ({ id, ...AI_PROVIDERS[id] }));
}

export function isProviderAvailable(provider) {
  return provider in AI_PROVIDERS;
}

export function getDefaultModel(provider) {
  return AI_PROVIDERS[provider]?.defaultModel;
}

// فئات الموديلات (إن وُجدت في المزوّد)
export function getModelCategories(provider) {
  const models = getProviderModels(provider);
  const cats = [...new Set(models.map((m) => m.category).filter(Boolean))];
  return cats.map((c) => ({ id: c, name: c.charAt(0).toUpperCase() + c.slice(1), models: models.filter((m) => m.category === c), count: models.filter((m) => m.category === c).length }));
}

// تعليمات إعداد (تُعرض للمستخدم)
export function getSetupInstructions(provider) {
  const cfg = getProviderConfig(provider);
  if (!cfg) return {};
  if (provider === 'ollama') {
    return {
      install: 'curl -fsSL https://ollama.com/install.sh | sh',
      start: 'ollama serve',
      pullModel: 'ollama pull llama3.2:3b-instruct',
      verify: 'ollama list'
    };
  }
  if (provider === 'lmstudio') {
    return {
      download: 'Download from https://lmstudio.ai/',
      setup: 'Load a model in LM Studio GUI',
      start: 'Start the local server in LM Studio',
      verify: 'Check server status in LM Studio'
    };
  }
  if (provider === 'openrouter') {
    return {
      doc: 'https://openrouter.ai',
      note: 'أضف مفتاح OpenRouter في المتغير VITE_OPENROUTER_API_KEY ثم حمّل قائمة الموديلات المجانية من الإعدادات.'
    };
  }
  if (provider === 'gemini') {
    return {
      doc: 'https://ai.google.dev/',
      note: 'أضف مفتاح Gemini في المتغير VITE_GEMINI_API_KEY. تأكد أن طبقة aiClient تدعم adapter: gemini.'
    };
  }
  return {};
}

// الروابط المدعومة (للمزوّد المحلي غالبًا)
export function getSupportedUrls(provider) {
  const cfg = getProviderConfig(provider);
  if (!cfg) return [];
  if (cfg.supportedUrls) return cfg.supportedUrls;
  return cfg.baseURL ? [cfg.baseURL] : [];
}

// ============== اكتشاف محلي اختياري (يدوي فقط) ==============
/**
 * دالة خفيفة لاختبار منفذ محلي بدون spam: تُستخدم فقط عندما يختار المستخدم المزود المحلي.
 */
export async function probeLocalUrl(url, { timeoutMs = 300 } = {}) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * يحاول إيجاد أول مزود محلي متاح (Ollama ثم LM Studio).
 * يُستدعى فقط عندما يختار المستخدم Local Provider من الإعدادات.
 */
export async function detectLocalAvailability() {
  const list = [
    ...getSupportedUrls('ollama'),
    ...getSupportedUrls('lmstudio')
  ];
  for (const url of list) {
    // نجرّب HEAD على endpoint /chat/completions
    const ok = await probeLocalUrl(url);
    if (ok) return url;
  }
  return null;
}

/**
 * محاولة مزامنة الموديل النشط من المزوّد المحلي.
 * - LM Studio: GET /v1/models -> data[].
 * - Ollama: GET /api/tags -> models[].
 * ملاحظة: ننفّذ الطلب فقط حين يضغط المستخدم زر "مزامنة" في الإعدادات.
 */
export async function getActiveLocalModel(provider) {
  try {
    if (provider === 'lmstudio') {
      const base = AI_PROVIDERS.lmstudio.baseURL.replace('/chat/completions', '');
      const res = await fetch(`${base}/v1/models`);
      const data = await res.json();
      // نعيد أول موديل متاح كـ "نشط"
      return data?.data?.[0]?.id || AI_PROVIDERS.lmstudio.defaultModel;
    }
    if (provider === 'ollama') {
      const base = AI_PROVIDERS.ollama.baseURL.replace('/v1/chat/completions', '');
      const res = await fetch(`${base}/api/tags`);
      const data = await res.json();
      return data?.models?.[0]?.name || AI_PROVIDERS.ollama.defaultModel;
    }
  } catch {
    // تجاهُل الأخطاء والاكتفاء بالافتراضي
  }
  return getDefaultModel(provider);
}

// ============== جلب موديلات OpenRouter المجانية ==============
/**
 * يجلب قائمة الموديلات من OpenRouter ويصفي فقط المجاني (prompt pricing = 0).
 * يُستدعى من شاشة الإعدادات عند اختيار OpenRouter.
 */
export async function fetchOpenRouterModels(apiKey, { freeOnly = true } = {}) {
  const url = 'https://openrouter.ai/api/v1/models';
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch OpenRouter models');
    const data = await res.json();
    let models = Array.isArray(data?.data) ? data.data : [];

    // تحويل بيانات OpenRouter إلى شكل موحّد لدينا
    models = models.map((m) => ({
      id: m.id,
      name: m.name || m.id,
      description: m.description || '',
      contextLength: m?.context_length || m?.context || 0,
      pricing: {
        input: m?.pricing?.prompt ?? null,
        output: m?.pricing?.completion ?? null
      },
      category: m?.tags?.includes('code') ? 'code' : 'general',
      recommended: Boolean(m?.top_provider || m?.meta?.rank)
    }));

    if (freeOnly) {
      models = models.filter((m) => Number(m.pricing.input || 0) === 0);
    }
    return models;
  } catch {
    // لا نرمي خطأ للواجهة؛ نعيد مصفوفة فارغة لتقرّر الواجهة استخدام seed/fallback.
    return [];
  }
}

// ============== اختيار المزود/الموديل الافتراضي ==============
/**
 * القاعدة:
 * - في السحابة: نسمح فقط بـ OpenRouter أو Gemini. الأسبقية لـ OpenRouter إذا توافر مفتاحه، وإلا Gemini إذا توافر مفتاحه.
 * - محليًا: إن اختار المستخدم مزودًا محليًا فسنحترم اختياره. إن لم يختر، يمكنه الضغط على "اكتشاف محلي" في الإعدادات.
 */
export function resolveDefaultProvider() {
  const inCloud = isCloudEnv();
  if (inCloud) {
    const hasOR = Boolean(getUserApiKey('openrouter'));
    const hasGM = Boolean(getUserApiKey('gemini'));
    if (hasOR) return 'openrouter';
    if (hasGM) return 'gemini';
    return 'openrouter';
  }
  // في البيئة المحلية، يبقى القرار يدوي عبر شاشة الإعدادات
  return null;
}

export function resolveDefaultModel(provider = resolveDefaultProvider()) {
  return getDefaultModel(provider);
}

// مُصدَّرات افتراضية متوافقة مع الشيفرة الحالية
export const DEFAULT_PROVIDER = resolveDefaultProvider();
export const DEFAULT_MODEL = resolveDefaultModel(DEFAULT_PROVIDER);