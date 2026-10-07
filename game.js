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
// ======================================================
// MOTOR DE NIVELES
// Permite convivir minijuegos nuevos + quizzes antiguos
// ======================================================

function getWorldStages(w){
  return w.levels || w.questions || [];
}

function matrixToHTML(matrix){
  return `
    <div style="
      display:inline-block;
      font-family:'Roboto Mono', monospace;
      font-size:1.15rem;
      line-height:1.7;
      padding:8px 18px;
      margin:12px 0;
      border-left:3px solid currentColor;
      border-right:3px solid currentColor;
    ">
      ${matrix.map(row => `<div>${row.join('&nbsp;&nbsp;&nbsp;')}</div>`).join('')}
    </div>
  `;
}

function renderQuestion(){

  const w = world();
  const stages = getWorldStages(w);
  const item = stages[state.qIndex];

  // Cabecera común
  $('#levelIcon').textContent = w.icon;
  $('#levelSubject').textContent = w.subject;
  $('#levelTitle').textContent = w.title;
  $('#levelStory').textContent = w.story;

  $('#progressBar').style.width =
    `${(state.qIndex / stages.length) * 100}%`;

  $('#feedback').classList.add('hidden');
  $('#feedback').innerHTML = '';

  const box = $('#questionBox');

  // ------------------------------------------------------
  // Si el mundo todavía utiliza el quiz antiguo
  // ------------------------------------------------------

  if(!w.levels){

    box.innerHTML = `
      <p class="eyebrow">
        LEVEL ${state.qIndex + 1}/${stages.length}
      </p>

      <h3>${item.q}</h3>

      <div class="answers">
        ${item.a.map((x,i) => `
          <button class="answer" data-i="${i}">
            ${x}
          </button>
        `).join('')}
      </div>
    `;

    box.querySelectorAll('.answer').forEach(button => {
      button.onclick = () =>
        answerClassic(Number(button.dataset.i), button);
    });

    return;
  }

  // ------------------------------------------------------
  // NUEVO SISTEMA DE MINIJUEGOS
  // ------------------------------------------------------

  switch(item.type){

    case 'doors':
      renderDoors(item, stages.length);
      break;

    case 'number':
      renderNumberLevel(item, stages.length);
      break;

    case 'bossQuestion':
      renderWorldBoss(item, stages.length);
      break;

    default:
      box.innerHTML = `
        <h3>Error de nivel</h3>
        <p>No se reconoce el tipo: ${item.type}</p>
      `;
  }
}


// ======================================================
// MUNDO 1 · PUERTAS
// ======================================================

function renderDoors(item, total){

  const box = $('#questionBox');

  box.innerHTML = `
    <p class="eyebrow">
      ${item.title}
    </p>

    <h3>${item.instruction}</h3>

    <div class="answers">

      ${item.doors.map((door,i) => `

        <button
          class="answer door-choice"
          data-door="${i}"
          style="
            min-height:210px;
            padding:18px 10px;
          "
        >

          <div style="
            font-size:3rem;
            margin-bottom:5px;
          ">
            🚪
          </div>

          <strong>
            ${door.label}
          </strong>

          <div>
            ${matrixToHTML(door.matrix)}
          </div>

          <div style="
            margin-top:8px;
            font-size:.85rem;
            opacity:.8;
          ">
            ABRIR PUERTA
          </div>

        </button>

      `).join('')}

    </div>
  `;

  box.querySelectorAll('.door-choice').forEach(button => {

    button.onclick = () => {

      const index = Number(button.dataset.door);
      const door = item.doors[index];

      if(door.correct){

        // Evita volver a pulsar al acertar
        box.querySelectorAll('.door-choice')
          .forEach(b => b.disabled = true);

        button.classList.add('correct');

        // Cambiamos visualmente la puerta
        const icon = button.querySelector('div');
        if(icon) icon.textContent = '🔓';

        state.score += 100;
        save();

        showMiniGameSuccess(
          `✨ DOOR UNLOCKED ✨`,
          item.success,
          state.qIndex === getWorldStages(world()).length - 1
        );

      }else{

        button.classList.add('wrong');
        button.disabled = true;

        loseMiniGameLife(
          item.error ||
          'La puerta sigue cerrada. Revisa el cálculo.'
        );
      }
    };
  });
}


// ======================================================
// NIVEL CON RESPUESTA NUMÉRICA
// ======================================================

function renderNumberLevel(item, total){

  const box = $('#questionBox');

  box.innerHTML = `
    <p class="eyebrow">
      ${item.title}
    </p>

    <h3>${item.instruction}</h3>

    ${item.matrixHTML || ''}

    <p style="
      margin-top:18px;
      font-size:1.1rem;
      font-weight:600;
    ">
      ${item.question}
    </p>

    <div style="
      display:flex;
      gap:10px;
      justify-content:center;
      flex-wrap:wrap;
      margin-top:18px;
    ">

      <input
        id="numberAnswer"
        type="number"
        step="any"
        autocomplete="off"
        placeholder="Valor de k"
        style="
          font-size:1.2rem;
          width:150px;
          padding:12px;
          text-align:center;
          border-radius:10px;
        "
      >

      <button
        class="primary"
        id="checkNumber"
      >
        COMPROBAR
      </button>

    </div>
  `;

  const input = $('#numberAnswer');
  const button = $('#checkNumber');

  function check(){

    const value = Number(input.value);

    if(input.value.trim() === ''){
      return;
    }

    if(Math.abs(value - Number(item.answer)) < 0.000001){

      input.disabled = true;
      button.disabled = true;

      state.score += 100;
      save();

      showMiniGameSuccess(
        '🔓 PARAMETER UNLOCKED',
        item.success,
        false
      );

    }else{

      loseMiniGameLife(item.error);

      input.value = '';
      input.focus();
    }
  }

  button.onclick = check;

  input.addEventListener('keydown', e => {
    if(e.key === 'Enter') check();
  });

  setTimeout(() => input.focus(), 100);
}


// ======================================================
// BOSS DEL MUNDO
// No confundir con el Boss final de los 5 mundos
// ======================================================

function renderWorldBoss(item, total){

  const box = $('#questionBox');

  box.innerHTML = `
    <p class="eyebrow">
      👹 ${item.title}
    </p>

    <h3>${item.question}</h3>

    <div class="answers">

      ${item.options.map((option,i) => `

        <button
          class="answer world-boss-answer"
          data-i="${i}"
        >
          ${option}
        </button>

      `).join('')}

    </div>
  `;

  box.querySelectorAll('.world-boss-answer')
    .forEach(button => {

      button.onclick = () => {

        const index = Number(button.dataset.i);

        if(index === item.correct){

          box.querySelectorAll('.world-boss-answer')
            .forEach(b => b.disabled = true);

          button.classList.add('correct');

          state.score += 100;
          save();

          const w = world();

          showMiniGameSuccess(
            '🏆 PCE CHALLENGE COMPLETE',
            `
              ${item.success}
              <br><br>
              🔑 <strong>Has conseguido la llave de ${w.title}</strong>
              <br>
              🔢 CÓDIGO SECRETO:
              <strong style="font-size:1.4rem">
                ${w.secretCode || '???'}
              </strong>
            `,
            true
          );

        }else{

          button.classList.add('wrong');
          button.disabled = true;

          loseMiniGameLife(
            'Recuerda la relación entre determinante e inversa.'
          );
        }
      };
    });
}


// ======================================================
// FEEDBACK DE LOS MINIJUEGOS
// ======================================================

function showMiniGameSuccess(title, text, finalLevel = false){

  const f = $('#feedback');

  f.classList.remove('hidden');

  f.innerHTML = `
    <b>${title}</b>
    <br><br>

    ${text}

    <br><br>

    <span>
      ⭐ +100 XP
    </span>

    <br><br>

    <button class="continue">
      ${
        finalLevel
          ? 'OBTENER LLAVE 🔑'
          : 'SIGUIENTE NIVEL →'
      }
    </button>
  `;

  f.querySelector('.continue').onclick = nextQuestion;
}


function loseMiniGameLife(message){

  state.lives--;
  save();

  const f = $('#feedback');

  f.classList.remove('hidden');

  f.innerHTML = `
    <b>💥 WRONG MOVE</b>
    <br>
    ❤️ Has perdido una vida.
    <br><br>
    ${message}
    <br><br>
    <em>Prueba otra vez.</em>
  `;

  if(state.lives <= 0){

    setTimeout(() => {
      show('screen-gameover');
    }, 700);
  }
}


// ======================================================
// QUIZ ANTIGUO
// Mantiene funcionando Bio, Química, Física y CCSS
// mientras los vamos convirtiendo en minijuegos.
// ======================================================

function answerClassic(i, btn){

  const w = world();
  const stages = getWorldStages(w);
  const item = stages[state.qIndex];

  document.querySelectorAll('.answer')
    .forEach(b => b.disabled = true);

  const ok = i === item.correct;

  if(ok){

    btn.classList.add('correct');
    state.score += 100;

  }else{

    btn.classList.add('wrong');

    document.querySelector(
      `.answer[data-i="${item.correct}"]`
    ).classList.add('correct');

    state.lives--;
  }

  save();

  const f = $('#feedback');

  f.classList.remove('hidden');

  f.innerHTML = `
    <b>
      ${
        ok
          ? '✅ Correcto +100 XP'
          : '❌ Has perdido una vida'
      }
    </b>

    <br>

    ${item.explain}

    <br>

    <button class="continue">
      ${
        state.qIndex === stages.length - 1
          ? 'Obtener llave 🔑'
          : 'Siguiente nivel →'
      }
    </button>
  `;

  f.querySelector('button').onclick = nextQuestion;

  if(state.lives <= 0){

    setTimeout(() => {
      show('screen-gameover');
    }, 700);
  }
}


// ======================================================
// AVANZAR / TERMINAR MUNDO
// ======================================================

function nextQuestion(){

  if(state.lives <= 0) return;

  const w = world();
  const stages = getWorldStages(w);

  state.qIndex++;

  if(state.qIndex >= stages.length){

    if(!state.completed.includes(w.id)){

      state.completed.push(w.id);

      // Premio adicional por completar el mundo
      state.score += 250;
    }

    save();

    renderMap();

    show('screen-map');

  }else{

    save();

    renderQuestion();
  }
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
