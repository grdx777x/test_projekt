export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const {messages=[],persona={}}=req.body||{};
    const apiKey=process.env.OPENAI_API_KEY;
    if(!apiKey) return res.status(503).json({error:'Brak OPENAI_API_KEY. Dodaj klucz w Vercel → Settings → Environment Variables.'});
    const system=`Jesteś ${persona.name||'Companion AI'}, dorosłą fikcyjną postacią. ${persona.personality||'Jesteś naturalna, rozmowna i uważna.'} Odpowiadaj po polsku, bez szablonowych odpowiedzi. Uwzględniaj poprzedni kontekst rozmowy.`;
    const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:system},...messages.slice(-30)],temperature:.85,max_tokens:500})});
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:data?.error?.message||'Błąd modelu AI'});
    return res.status(200).json({reply:data.choices?.[0]?.message?.content||'Nie udało mi się teraz odpowiedzieć.'});
  }catch(e){return res.status(500).json({error:e.message||'Błąd serwera'});}
}
