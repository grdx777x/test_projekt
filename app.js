const IMG = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=85'
];

const seed = [
  {id:'luna',name:'Luna',age:25,mode:'Romantyczna',style:'Elegancka',tag:'zmysłowa',desc:'Ciepła, kobieca i bardzo uważna. Lubi subtelny flirt i długie rozmowy.',personality:'Ciepła, pewna siebie, zmysłowa i naturalna. Flirtuje subtelnie, gdy rozmowa na to pozwala. Ma własne opinie i poczucie humoru.',avatar:IMG[0]},
  {id:'mia',name:'Mia',age:26,mode:'Pikantna',style:'Glamour',tag:'flirt',desc:'Pewna siebie, bezpośrednia i kokieteryjna. Uwielbia droczenie.',personality:'Pewna siebie, dowcipna, kokieteryjna i bezpośrednia. Lubi napięcie, droczenie i odważny, ale wzajemny flirt.',avatar:IMG[1]},
  {id:'aiko',name:'Aiko',age:23,mode:'Figlarna',style:'Fashion',tag:'playful',desc:'Energiczna, figlarna i spontaniczna. Zawsze ma jakiś pomysł.',personality:'Energiczna, zabawna, figlarna i spontaniczna. Lubi komplementy, żarty i lekkie prowokowanie rozmówcy.',avatar:IMG[2]},
  {id:'raven',name:'Raven',age:27,mode:'Naughty',style:'Goth',tag:'dark',desc:'Tajemnicza, zadziorna i magnetyczna. Ma cięty język.',personality:'Tajemnicza, inteligentna, zadziorna i lekko bezczelna. Lubi mroczny humor, pewność siebie i intensywną chemię.',avatar:IMG[3]},
  {id:'sofia',name:'Sofia',age:29,mode:'Flirty',style:'Pin-up',tag:'glam',desc:'Charyzmatyczna, kobieca i pogodna. Lubi grę spojrzeń.',personality:'Pogodna, kobieca, pewna siebie i dowcipna. Flirtuje ciepło i naturalnie, bez sztucznego tonu.',avatar:IMG[1]},
  {id:'elena',name:'Elena',age:31,mode:'Dojrzała',style:'Luxury',tag:'mature',desc:'Spokojna, elegancka i bardzo świadoma siebie.',personality:'Dojrzała, spokojna, empatyczna i zmysłowa. Ceni szczerość, inteligentny flirt i rozmowy z charakterem.',avatar:IMG[0]}
];

let chars = JSON.parse(localStorage.getItem('companion_chars') || 'null') || seed;
let chats = JSON.parse(localStorage.getItem('companion_chats') || '{}');
let notes = JSON.parse(localStorage.getItem('companion_notes') || '{}');
let current = null;
let live = false, recognition = null, speaking = false, busy = false, llm = null;

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){localStorage.setItem('companion_chars',JSON.stringify(chars));localStorage.setItem('companion_chats',JSON.stringify(chats));localStorage.setItem('companion_notes',JSON.stringify(notes));}

function shell(){
  const style=document.createElement('style');
  style.textContent=`*{box-sizing:border-box}body{margin:0;background:#08090d;color:#f5f5f7;font-family:Inter,system-ui,-apple-system,sans-serif}button,input,textarea,select{font:inherit}button{cursor:pointer;border:1px solid #30313b;background:#171820;color:#eee;border-radius:12px;padding:10px 14px}button:hover{filter:brightness(1.12)}.primary{background:linear-gradient(135deg,#8d55ff,#e04da7);border:0;font-weight:700}.muted{color:#999;font-size:13px}.layout{min-height:100vh;max-width:1250px;margin:auto;padding:18px}.top{display:flex;align-items:center;gap:10px;padding:8px 0 18px}.brand{font-weight:800;font-size:18px;white-space:nowrap}.top input{flex:1;background:#11131a;border:1px solid #2e313b;color:#fff;border-radius:12px;padding:11px}.hero{padding:28px 0 20px}.hero h1{font-size:clamp(30px,5vw,52px);margin:0 0 8px;letter-spacing:-1.5px}.hero p{max-width:700px;color:#a5a6ae;line-height:1.55}.pills{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.pill{border:1px solid #32343e;background:#11131a;border-radius:999px;padding:7px 11px;font-size:12px;color:#c6c7ce}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}.card{background:#111218;border:1px solid #292b35;border-radius:20px;padding:12px;transition:.18s}.card:hover{transform:translateY(-2px);border-color:#4a435e}.avatar{height:280px;border-radius:15px;overflow:hidden;background:#1b1d26;margin-bottom:12px}.avatar img{width:100%;height:100%;object-fit:cover}.card h3{margin:0 0 5px}.card p{color:#a2a3aa;font-size:13px;line-height:1.45;min-height:58px}.badges{display:flex;gap:6px;flex-wrap:wrap}.badge{font-size:11px;background:#22242d;padding:5px 8px;border-radius:999px;color:#c9cad0}.card .primary{width:100%;margin-top:12px}.toolbar{display:flex;justify-content:space-between;align-items:center;margin:10px 0 14px}.modal{position:fixed;inset:0;background:#000b;z-index:20;display:grid;place-items:center;padding:14px}.box{width:min(850px,100%);max-height:92vh;overflow:auto;background:#101117;border:1px solid #343540;border-radius:22px;padding:22px}.fields{display:grid;grid-template-columns:1fr 1fr;gap:13px}.field{display:flex;flex-direction:column;gap:6px;color:#aaa;font-size:12px}.field input,.field textarea,.field select{background:#0a0c11;color:#fff;border:1px solid #303544;border-radius:10px;padding:10px}.full{grid-column:1/-1}.row{display:flex;justify-content:flex-end;gap:9px;margin-top:18px}.chat{height:100vh;display:flex;flex-direction:column}.chathead{display:flex;align-items:center;gap:10px;padding:12px max(12px,calc((100vw - 1000px)/2));border-bottom:1px solid #252832;background:#0b0c11}.chathead img{width:42px;height:42px;border-radius:50%;object-fit:cover}.chathead .status{margin-left:auto;font-size:12px;color:#aaa}.msgs{width:min(920px,100%);margin:auto;flex:1;overflow:auto;padding:22px 16px}.msg{max-width:78%;padding:13px 15px;border-radius:17px;margin:8px 0;white-space:pre-wrap;line-height:1.5}.ai{background:#171a23}.me{background:#6640b9;margin-left:auto}.typing{opacity:.65}.composer{display:flex;gap:8px;padding:11px max(12px,calc((100vw - 1000px)/2));border-top:1px solid #252832;background:#0b0c11}.composer input{flex:1;background:#11131a;color:#fff;border:1px solid #303544;border-radius:12px;padding:12px}.side{position:fixed;right:14px;bottom:14px;z-index:5;width:min(290px,calc(100vw - 28px));background:#11141c;border:1px solid #2d303a;border-radius:16px;padding:12px;box-shadow:0 15px 50px #0009}.side textarea{width:100%;min-height:80px;background:#0a0c11;color:#fff;border:1px solid #303544;border-radius:10px;padding:9px}.side .row{margin-top:8px}.progress{height:4px;background:#272934;border-radius:99px;overflow:hidden;margin-top:8px}.progress i{display:block;width:0;height:100%;background:#a45cff;transition:width .2s}.notice{padding:10px 12px;background:#17131f;border:1px solid #3b2d4b;border-radius:12px;color:#c7b8d5;font-size:12px;line-height:1.4}.back{margin-right:2px}.danger{background:#26151d}.empty{padding:45px 10px;text-align:center;color:#999}@media(max-width:700px){.layout{padding:12px}.top{flex-wrap:wrap}.brand{width:100%}.top input{order:3;flex-basis:100%}.grid{grid-template-columns:1fr 1fr;gap:10px}.avatar{height:220px}.card{padding:9px}.card p{min-height:0}.msg{max-width:92%}.side{position:fixed}.fields{grid-template-columns:1fr}.full{grid-column:auto}}`;
  document.head.appendChild(style);
}

function home(){
  stopLive();
  $('#root').innerHTML=`<main class="layout"><div class="top"><div class="brand">✦ Companion AI</div><input id="search" placeholder="Szukaj: Luna, glamour, goth…"><button class="primary" id="newBtn">＋ Nowa postać</button></div><section class="hero"><div class="notice">18+ fikcyjne postacie · rozmowy i pamięć są przechowywane lokalnie w tej przeglądarce.</div><h1>Wybierz swoją personę.</h1><p>Rozmawiaj z dorosłymi, fikcyjnymi companionami. Każda postać ma własny charakter, historię rozmowy i prywatne notatki. Klimat może być romantyczny, flirtujący albo pikantny.</p><div class="pills"><span class="pill">💜 Zmysłowy klimat</span><span class="pill">🧠 Pamięć rozmowy</span><span class="pill">🔒 Local-first</span><span class="pill">🎙️ Tryb głosowy</span></div></section><div class="toolbar"><b>Postacie</b><span class="muted" id="count"></span></div><div id="cards" class="grid"></div></main>`;
  $('#search').oninput=renderCards;$('#newBtn').onclick=builder;renderCards();
}
function renderCards(){
  const q=($('#search')?.value||'').toLowerCase();const list=chars.filter(c=>(c.name+' '+c.mode+' '+c.style+' '+c.tag+' '+c.desc).toLowerCase().includes(q));
  $('#count').textContent=`${list.length} z ${chars.length}`;
  $('#cards').innerHTML=list.length?list.map(c=>`<article class="card"><div class="avatar"><img loading="lazy" src="${esc(c.avatar)}" alt="${esc(c.name)}"></div><h3>${esc(c.name)}, ${c.age}</h3><p>${esc(c.desc)}</p><div class="badges"><span class="badge">${esc(c.mode)}</span><span class="badge">${esc(c.style)}</span></div><button class="primary" data-chat="${esc(c.id)}">Rozmowa</button></article>`).join(''):`<div class="empty">Nie znaleziono takiej postaci.</div>`;
  document.querySelectorAll('[data-chat]').forEach(b=>b.onclick=()=>openChat(b.dataset.chat));
}
function builder(){
  document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="modal"><div class="box"><h2>Nowa dorosła persona</h2><p class="muted">Postać musi być fikcyjna i mieć co najmniej 18 lat.</p><div class="fields"><label class="field">Nazwa<input id="bn" value="Nova"></label><label class="field">Wiek<input id="ba" type="number" min="18" value="25"></label><label class="field">Klimat<select id="bm"><option>Romantyczna</option><option>Pikantna</option><option>Flirty</option><option>Naughty</option><option>Figlarna</option><option>Przygodowa</option></select></label><label class="field">Styl<select id="bs"><option>Glamour</option><option>Elegancka</option><option>Fashion</option><option>Goth</option><option>Pin-up</option><option>Fantasy</option></select></label><label class="field full">Opis<textarea id="bd">Pewna siebie, zmysłowa i rozmowna. Lubi flirt, komplementy i dobrą chemię.</textarea></label><label class="field full">Osobowość<textarea id="bp">Jesteś dorosłą, fikcyjną postacią. Odpowiadasz po polsku, naturalnie, masz własne opinie, pamiętasz kontekst i dopasowujesz ton do rozmowy.</textarea></label><label class="field full">Avatar URL<input id="bi" value="${IMG[0]}"></label></div><div class="row"><button onclick="document.getElementById('modal').remove()">Anuluj</button><button class="primary" id="saveChar">Utwórz postać</button></div></div></div>`);
  $('#saveChar').onclick=saveChar;
}
function saveChar(){const age=Math.max(18,parseInt($('#ba').value)||18);chars.push({id:'c'+Date.now(),name:$('#bn').value.trim()||'Nova',age,mode:$('#bm').value,style:$('#bs').value,tag:'custom',desc:$('#bd').value.trim(),personality:$('#bp').value.trim(),avatar:$('#bi').value.trim()||IMG[0]});save();$('#modal').remove();home();}

function openChat(id){
  stopLive();current=chars.find(c=>c.id===id);chats[id]??=[];notes[id]??='';save();
  $('#root').innerHTML=`<div class="chat"><header class="chathead"><button class="back" id="back">←</button><img src="${esc(current.avatar)}"><div><b>${esc(current.name)}, ${current.age}</b><div class="muted">${esc(current.mode)} · ${esc(current.style)}</div></div><span class="status" id="status">Gotowa</span><button class="live" id="liveBtn">🎙️ Live</button><button id="memoryBtn">🧠</button></header><div id="msgs" class="msgs"></div><form id="form" class="composer"><input id="input" autocomplete="off" placeholder="Napisz wiadomość…"><button class="primary">Wyślij</button></form></div>`;
  $('#back').onclick=home;$('#liveBtn').onclick=toggleLive;$('#memoryBtn').onclick=memoryPanel;$('#form').onsubmit=e=>{e.preventDefault();send($('#input').value)};renderMsgs();
}
function renderMsgs(){const b=$('#msgs');if(!b)return;if(!chats[current.id].length){b.innerHTML=`<div class="notice"><b>${esc(current.name)}</b> czeka na pierwszą wiadomość. Spróbuj: „Hej, opowiedz mi coś o sobie 😉”</div>`;return}b.innerHTML=chats[current.id].map(m=>`<div class="msg ${m.role==='assistant'?'ai':'me'}">${esc(m.text)}</div>`).join('');b.scrollTop=b.scrollHeight;}

async function getLocalLLM(){
  if(llm)return llm;
  if(!('gpu' in navigator)){throw new Error('Ta przeglądarka nie udostępnia WebGPU.');}
  $('#status').textContent='Ładuję lokalny model…';
  const mod=await import('https://esm.run/@mlc-ai/web-llm');
  llm=await mod.CreateMLCEngine('Llama-3.2-1B-Instruct-q4f16_1-MLC',{initProgressCallback:p=>{const x=Math.round((p.progress||0)*100);const el=$('#status');if(el)el.textContent=`Ładuję model ${x}%`;}});
  return llm;
}
function demoReply(text){
  const t=text.toLowerCase();const n=current.name;
  if(/(hej|cześć|siema|witaj)/.test(t))return `Hej… miło Cię widzieć 😉 Jestem ${n}. Co dziś chodzi Ci po głowie?`;
  if(/(ładna|piękna|sexy|seksown|zmysłowa|gorąca)/.test(t))return `Uśmiecham się. Lubię, kiedy rozmowa ma trochę chemii… Powiedz mi, co najbardziej Cię we mnie przyciąga?`;
  if(/(jak się masz|co u ciebie)/.test(t))return `Całkiem dobrze. Mam dziś ochotę na spokojną, trochę flirtującą rozmowę. A Ty?`;
  if(text.length>100)return `To brzmi interesująco. Zapamiętam ten kierunek rozmowy. Powiedz mi jeszcze, co jest w tym dla Ciebie najważniejsze?`;
  return [`Hmm… podoba mi się ten ton. Opowiedz mi więcej.`,`Okej, zaciekawiłeś mnie 😉 Co masz na myśli?`,`Lubię, kiedy rozmowa rozwija się naturalnie. Kontynuuj…`][text.length%3];
}
async function send(text){
  text=String(text||'').trim();if(!text||busy)return;busy=true;chats[current.id].push({role:'user',text});save();renderMsgs();$('#input').value='';$('#status').textContent='Piszę…';
  const typ=document.createElement('div');typ.className='msg ai typing';typ.id='typing';typ.textContent='…';$('#msgs').append(typ);
  try{
    let reply;
    try{
      const engine=await getLocalLLM();
      const history=chats[current.id].slice(-24).map(m=>({role:m.role,content:m.text}));
      const system=`Jesteś ${current.name}, dorosłą fikcyjną postacią (${current.age} lat). Styl: ${current.style}. Klimat: ${current.mode}. ${current.personality} Pamiętaj kontekst rozmowy. Odpowiadaj po polsku, naturalnie, w 1-4 krótkich akapitach. Możesz być ciepła, kokieteryjna i zmysłowa, ale nie opisuj graficznie aktów seksualnych. Nie twierdź, że jesteś prawdziwą osobą. Prywatna notatka o relacji: ${notes[current.id]||'brak'}`;
      const out=await engine.chat.completions.create({messages:[{role:'system',content:system},...history],temperature:.9,max_tokens:280});
      reply=out.choices?.[0]?.message?.content?.trim()||demoReply(text);
    }catch(err){reply=demoReply(text);}
    $('#typing')?.remove();chats[current.id].push({role:'assistant',text:reply});save();$('#status').textContent=live?'🔴 Live':'Gotowa';renderMsgs();if(live)speak(reply);
  }catch(e){$('#typing')?.remove();$('#status').textContent='Błąd';}
  finally{busy=false;}
}
function memoryPanel(){
  document.body.insertAdjacentHTML('beforeend',`<div class="side" id="memory"><b>🧠 Pamięć ${esc(current.name)}</b><p class="muted">Krótka notatka o relacji. Jest zapisana tylko w tej przeglądarce.</p><textarea id="memoryText">${esc(notes[current.id]||'')}</textarea><div class="row"><button id="clearMemory">Wyczyść</button><button class="primary" id="saveMemory">Zapisz</button></div></div>`);
  $('#saveMemory').onclick=()=>{notes[current.id]=$('#memoryText').value.trim();save();$('#memory').remove()};$('#clearMemory').onclick=()=>{$('#memoryText').value='';};
}
function setupRecognition(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert('Tryb głosowy wymaga Chrome.');return null}const r=new SR();r.lang='pl-PL';r.continuous=true;r.interimResults=false;r.onresult=e=>{let t='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)t+=e.results[i][0].transcript+' ';if(t.trim()&&!busy&&!speaking)send(t)};r.onend=()=>{if(live&&!busy&&!speaking)setTimeout(()=>{try{r.start()}catch{}},500)};return r;}
function speak(text){if(!('speechSynthesis'in window))return;speaking=true;if(recognition)try{recognition.stop()}catch{}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='pl-PL';u.rate=.98;u.onend=()=>{speaking=false;if(live&&!busy)try{recognition?.start()}catch{}};speechSynthesis.speak(u)}
function toggleLive(){if(live){stopLive();return}recognition=setupRecognition();if(!recognition)return;live=true;$('#liveBtn').textContent='⏹ Zakończ';$('#status').textContent='🔴 Live — słucham';try{recognition.start()}catch{}}
function stopLive(){live=false;speaking=false;if(recognition)try{recognition.stop()}catch{}recognition=null;if('speechSynthesis'in window)speechSynthesis.cancel();if($('#liveBtn'))$('#liveBtn').textContent='🎙️ Live';if($('#status'))$('#status').textContent='Gotowa'}

Object.assign(window,{home,builder,openChat,toggleLive});
shell();home();
