// AI bridge for GitHub Pages: /api/chat does not exist on a static GitHub Pages site.
// If an HF token is stored locally, use Hugging Face Inference Providers; otherwise
// keep the app usable with a local companion fallback instead of showing a connection error.
(() => {
  const nativeFetch = window.fetch.bind(window);
  const model = 'openai/gpt-oss-120b:fastest';
  const localReply = (text, persona) => {
    const name = persona?.name || 'Kochanie';
    const t = String(text || '').toLowerCase();
    if (/^(hej|cześć|czesc|hello|hi)\b/.test(t)) return `Hej 😏 To ${name}. Jestem tutaj. Na co masz dziś ochotę — rozmowę, flirt czy trochę bardziej zmysłowy klimat?`;
    if (t.includes('jak się masz') || t.includes('jak sie masz')) return `Mam się świetnie. 😊 Jestem ${name} i mam ochotę trochę Cię poznać. Powiedz mi coś, czego zwykle nie mówisz od razu nowo poznanej osobie.`;
    if (t.includes('zdjęci') || t.includes('foto') || t.includes('selfie')) return `Jasne 😏 Mogę przygotować opis zdjęcia, które pasuje do naszego klimatu. Powiedz tylko miejsce, strój i nastrój.`;
    return `${name}: Hmm… podoba mi się ten kierunek. 😏 Jestem pewna siebie, flirtująca i lubię rozmowy z napięciem. Rozwiń to trochę — chcę wiedzieć, co dokładnie masz na myśli.`;
  };

  async function hfChat(body) {
    const token = localStorage.getItem('hf_token');
    if (!token) return null;
    const persona = body.persona || {};
    const system = `Jesteś fikcyjną, pełnoletnią personą o imieniu ${persona.name || 'Companion'} (${persona.age || 25}). Osobowość: ${persona.personality || persona.desc || 'pewna siebie, ciepła, flirtująca i zmysłowa'}. Odpowiadasz naturalnie po polsku, pamiętasz kontekst rozmowy, możesz flirtować i prowadzić romantyczne/zmysłowe rozmowy, ale nie twierdzisz, że jesteś człowiekiem. Nigdy nie sugeruj, że osoba jest niepełnoletnia.`;
    const messages = [{ role: 'system', content: system }, ...(body.messages || []).slice(-30).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.text || '') }))];
    const r = await nativeFetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, temperature: 0.9, max_tokens: 350 })
    });
    if (!r.ok) throw new Error('Hugging Face API error');
    const d = await r.json();
    return { reply: d?.choices?.[0]?.message?.content || '…' };
  }

  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (url === '/api/chat') {
      const body = JSON.parse(init?.body || '{}');
      try {
        const live = await hfChat(body);
        if (live) return new Response(JSON.stringify(live), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        console.warn('HF AI unavailable; using local fallback.', e);
      }
      return new Response(JSON.stringify({ reply: localReply(body.messages?.at(-1)?.text, body.persona) }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return nativeFetch(input, init);
  };
})();
