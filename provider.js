const KEY='ai_provider';
const labels={demo:'Demo — bez klucza',groq:'Groq — darmowy limit',gemini:'Gemini — darmowy limit',openai:'OpenAI — płatny'};
const saved=localStorage.getItem(KEY)||'demo';
window.AI_PROVIDER=saved;
const originalFetch=window.fetch.bind(window);
window.fetch=async (input,init={})=>{
  try{const url=typeof input==='string'?input:input.url;if(url.endsWith('/api/chat')&&init.body){const body=JSON.parse(init.body);body.provider=window.AI_PROVIDER;init={...init,body:JSON.stringify(body)}}}catch{}
  return originalFetch(input,init);
};
function mount(){if(document.getElementById('providerPicker'))return;const el=document.createElement('div');el.id='providerPicker';el.style.cssText='position:fixed;right:12px;bottom:12px;z-index:9999;background:#11141c;border:1px solid #303544;border-radius:14px;padding:8px;box-shadow:0 8px 30px #0008';el.innerHTML='<select id="providerSelect" style="background:#0a0c11;color:#fff;border:0;padding:8px;border-radius:9px"></select>';
const s=el.querySelector('select');Object.entries(labels).forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;s.appendChild(o)});s.value=window.AI_PROVIDER;s.onchange=()=>{window.AI_PROVIDER=s.value;localStorage.setItem(KEY,s.value)};document.body.appendChild(el)}
new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});setTimeout(mount,500);