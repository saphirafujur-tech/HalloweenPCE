const $ = s => document.querySelector(s);
const screens = [...document.querySelectorAll('.screen')];
const state = JSON.parse(localStorage.getItem('halloweenPCE')) || {lives:3,score:0,completed:[],current:null,qIndex:0};

function save(){localStorage.setItem('halloweenPCE',JSON.stringify(state));updateHud()}
function updateHud(){$('#lives').textContent=state.lives;$('#score').textContent=state.score;$('#keys').textContent=state.completed.length}
function show(id){screens.forEach(s=>s.classList.remove('active'));$('#'+id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}
function reset(){Object.assign(state,{lives:3,score:0,completed:[],current:null,qIndex:0});save();renderMap();show('screen-home')}

function renderMap(){
  const grid=$('#worldGrid'); grid.innerHTML='';
  WORLDS.forEach(w=>{
    const done=state.completed.includes(w.id);
    const card=document.createElement('article');
    card.className='world-card'+(done?' completed':'');
    card.style.setProperty('--glow',w.glow+'33'); card.style.setProperty('--glow-solid',w.glow);
    card.innerHTML=`<div class="world-icon">${w.icon}</div><p class="eyebrow">${w.subject}</p><h3>${w.title}</h3><p>${w.story}</p>`;
    card.onclick=()=>startWorld(w.id); grid.appendChild(card);
  });
  const unlocked=state.completed.length===WORLDS.length;
  $('#bossCard').classList.toggle('locked',!unlocked);$('#bossCard').classList.toggle('unlocked',unlocked);
  $('#bossBtn').disabled=!unlocked;$('#bossStatus').textContent=unlocked?'Las cinco llaves responden. El portal está abierto.':'Necesitas las 5 llaves.';
}

function startWorld(id){state.current=id;state.qIndex=0;save();renderQuestion();show('screen-level')}
function world(){return WORLDS.find(w=>w.id===state.current)}
function renderQuestion(){
  const w=world(), item=w.questions[state.qIndex];
  $('#levelIcon').textContent=w.icon;$('#levelSubject').textContent=w.subject;$('#levelTitle').textContent=w.title;$('#levelStory').textContent=w.story;
  $('#progressBar').style.width=`${(state.qIndex/w.questions.length)*100}%`;
  $('#feedback').classList.add('hidden');$('#feedback').innerHTML='';
  const box=$('#questionBox');
  box.innerHTML=`<p class="eyebrow">LEVEL ${state.qIndex+1}/${w.questions.length}</p><h3>${item.q}</h3><div class="answers">${item.a.map((x,i)=>`<button class="answer" data-i="${i}">${x}</button>`).join('')}</div>`;
  box.querySelectorAll('.answer').forEach(b=>b.onclick=()=>answer(Number(b.dataset.i),b));
}
function answer(i,btn){
  const w=world(),item=w.questions[state.qIndex];
  document.querySelectorAll('.answer').forEach(b=>b.disabled=true);
  const ok=i===item.correct;
  if(ok){btn.classList.add('correct');state.score+=100}else{btn.classList.add('wrong');document.querySelector(`.answer[data-i="${item.correct}"]`).classList.add('correct');state.lives--}
  save();
  const f=$('#feedback');f.classList.remove('hidden');f.innerHTML=`<b>${ok?'✅ Correcto +100 XP':'❌ Has perdido una vida'}</b><br>${item.explain}<br><button class="continue">${state.qIndex===w.questions.length-1?'Obtener llave 🔑':'Siguiente nivel →'}</button>`;
  f.querySelector('button').onclick=nextQuestion;
  if(state.lives<=0)setTimeout(()=>show('screen-gameover'),700)
}
function nextQuestion(){
  if(state.lives<=0)return;
  const w=world();state.qIndex++;
  if(state.qIndex>=w.questions.length){
    if(!state.completed.includes(w.id)){state.completed.push(w.id);state.score+=250}
    save();renderMap();show('screen-map');
  }else{save();renderQuestion()}
}

function renderBoss(){
  const wrap=$('#bossQuestions');
  wrap.innerHTML=BOSS.map((b,i)=>`<div class="boss-challenge"><p class="eyebrow">BOSS PHASE ${i+1}</p><h3>${b.q}</h3><input id="boss-${i}" autocomplete="off" placeholder="Escribe tu respuesta"></div>`).join('')+`<button class="boss-submit" id="bossSubmit">⚔ Atacar al Boss</button><div id="bossFeedback" class="feedback hidden"></div>`;
  $('#bossSubmit').onclick=checkBoss;
}
function norm(s){return String(s).trim().toUpperCase().replace('%','')}
function checkBoss(){
  const wrong=BOSS.filter((b,i)=>norm($('#boss-'+i).value)!==norm(b.answer)).length;
  const f=$('#bossFeedback');f.classList.remove('hidden');
  if(wrong===0){state.score+=1000;save();$('#finalScore').textContent=state.score;setTimeout(()=>show('screen-win'),500)}
  else{state.lives--;save();f.innerHTML=`💥 ${wrong} respuesta(s) incorrecta(s). El Boss contraataca: pierdes 1 vida.`;if(state.lives<=0)setTimeout(()=>show('screen-gameover'),700)}
}

$('#startBtn').onclick=()=>{renderMap();show('screen-map')};$('#resetBtn').onclick=reset;$('#backBtn').onclick=()=>{renderMap();show('screen-map')};
$('#bossBtn').onclick=()=>{renderBoss();show('screen-boss')};$('#playAgainBtn').onclick=reset;$('#retryBtn').onclick=reset;
updateHud();renderMap();
