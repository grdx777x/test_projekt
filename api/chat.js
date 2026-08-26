export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const {messages=[],persona={},provider='demo'}=req.body||{};
    const system=`Jesteś ${persona.name||'Companion AI'}, dorosłą fikcyjną postacią. ${persona.personality||'Jesteś naturalna, rozmowna i uważna.'} Odpowiadaj po polsku, bez szablonowych odpowiedzi. Uwzględniaj poprzedni kontekst rozmowy.`;
    const history=[{role:'system',content:system},...messages.slice(-30)];
    if(provider==='demo'){
      const last=messages.filter(m=>m.role==='user').at(-1)?.content||'';
      const replies=[`Rozumiem. Opowiedz mi trochę więcej — chcę dobrze złapać kontekst.`,`Jasne 😊 Jestem z Tobą. Co dokładnie masz na myśli?`,`To brzmi ciekawie. Kontynuuj, a dopasuję się do rozmowy.`];
      return res.status(200).json({reply:replies[last.length%replies.length]});
    }
    if(provider==='groq'){
      const key=process.env.GROQ_API_KEY;if(!key)return res.status(503).json({error:'Brak GROQ_API_KEY. Dodaj go w Vercel.'});
      const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model:process.env.GROQ_MODEL||'llama-3.1-8b-instant',messages:history,temperature:.85,max_tokens:500})});
      const d=await r.json();if(!r.ok)throw new Error(d?.error?.message||'Błąd Groq');return res.json({reply:d.choices?.[0]?.message?.content||'Brak odpowiedzi.'});
    }
    if(provider==='gemini'){
      const key=process.env.GEMINI_API_KEY;if(!key)return res.status(503).json({error:'Brak GEMINI_API_KEY. Dodaj go w Vercel.'});
      const contents=messages.slice(-30).map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}));
      const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL||'gemini-2.5-flash'}:generateContent?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:.85,maxOutputTokens:500}})});
      const d=await r.json();if(!r.ok)throw new Error(d?.error?.message||'Błąd Gemini');return res.json({reply:d.candidates?.[0]?.content?.parts?.[0]?.text||'Brak odpowiedzi.'});
    }
    if(provider==='openai'){
      const key=process.env.OPENAI_API_KEY;if(!key)return res.status(503).json({error:'Brak OPENAI_API_KEY. Dodaj go w Vercel.'});
      const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:history,temperature:.85,max_tokens:500})});
      const d=await r.json();if(!r.ok)throw new Error(d?.error?.message||'Błąd OpenAI');return res.json({reply:d.choices?.[0]?.message?.content||'Brak odpowiedzi.'});
    }
    return res.status(400).json({error:'Nieznany dostawca AI.'});
  }catch(e){return res.status(500).json({error:e.message||'Błąd serwera'});}
}