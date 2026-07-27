const DAYS = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag"];
const DEFAULTS = [
  {start:"08:00", end:"17:00", mode:"fix"},
  {start:"08:00", end:"17:00", mode:"fix"},
  {start:"08:00", end:"15:00", mode:"fix"},
  {start:"08:00", end:"17:00", mode:"fix"},
  {start:"08:00", end:"", mode:"end"}
];
const daysEl = document.getElementById('days');
const targetEl = document.getElementById('target');
const pauseToggle = document.getElementById('pauseToggle');
const ARC_LEN = 213;

function getWeekNumber(d){
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date - yearStart) / 86400000) + 1)/7);
}

function build(){
  document.getElementById('kwNum').textContent = getWeekNumber(new Date());
  daysEl.innerHTML = "";
  DAYS.forEach((name,i)=>{
    const def = DEFAULTS[i];
    const short = name.slice(0,2).toUpperCase();
    const div = document.createElement('div');
    div.className = "day-card";
    div.innerHTML = `
      <div class="day-top">
        <div class="day-name-wrap">
          <div class="day-name">${name}</div>
          <span class="badge-active">aktiv berechnet</span>
        </div>
        <div class="day-netto zero" id="netto-${i}">–</div>
      </div>
      <div class="row-inputs">
        <div class="field"><label>${short} Start</label><input type="time" id="start-${i}" value="${def.start}"></div>
        <div class="field"><label>${short} Ende</label><input type="time" id="end-${i}" value="${def.end}"></div>
        <div class="mode-select">
          <label>Modus</label>
          <select id="mode-${i}">
            <option value="fix">Fix</option>
            <option value="end">Ende berechnen</option>
            <option value="start">Start berechnen</option>
          </select>
        </div>
      </div>
      <div class="meta-line">
        <span id="raw-${i}">Dauer –</span>
        <span id="pause-${i}">Pause –</span>
      </div>
    `;
    daysEl.appendChild(div);
    div.querySelector(`#mode-${i}`).value = def.mode;
  });

  daysEl.querySelectorAll('input, select').forEach(el=>{
    el.addEventListener('input', ()=>{
      if(el.tagName==='SELECT' && el.value!=='fix'){
        const i = parseInt(el.id.split('-')[1],10);
        DAYS.forEach((_,j)=>{
          if(j!==i) document.getElementById(`mode-${j}`).value = 'fix';
        });
      }
      recalc();
    });
  });
  targetEl.addEventListener('input', recalc);
  pauseToggle.addEventListener('change', recalc);
}

function toMin(str){ if(!str) return null; const [h,m] = str.split(':').map(Number); return h*60+m; }
function toTime(min){ min=Math.round(min); min=((min%1440)+1440)%1440; const h=Math.floor(min/60); const m=min%60; return String(h).padStart(2,'0')+":"+String(m).padStart(2,'0'); }
function fmtH(min){ const sign=min<0?"-":""; min=Math.abs(Math.round(min)); const h=Math.floor(min/60); const m=min%60; return `${sign}${h}h ${String(m).padStart(2,'0')}min`; }
function pauseFor(rawMin){ if(!pauseToggle.checked) return 0; return rawMin>360? 30 : 0; }

function recalc(){
  const targetMin = Math.round(parseFloat(targetEl.value||"0")*60);
  const computeIdx = DAYS.findIndex((_,i)=>document.getElementById(`mode-${i}`).value!== 'fix');
  const pauseEnabled = pauseToggle.checked;

  document.getElementById('pauseLabel').textContent = pauseEnabled? "30 Min. ab >6h abziehen" : "Keine Pause";
  document.getElementById('noteTitle').textContent = pauseEnabled? "Pause aktiv:" : "Pause aus:";
  document.getElementById('noteText').textContent = pauseEnabled? "Bei mehr als 6h werden automatisch 30 Min. abgezogen." : "Pausen werden nicht abgezogen. Zeiten werden 1:1 gerechnet.";

  let fixedSum = 0;
  const nettoByDay = new Array(5).fill(0);
  for(let i=0;i<5;i++){
    if(i===computeIdx) continue;
    const s = toMin(document.getElementById(`start-${i}`).value);
    const e = toMin(document.getElementById(`end-${i}`).value);
    if(s===null || e<=s){ nettoByDay[i]=0; continue; }
    const raw = e-s; const pause = pauseFor(raw); nettoByDay[i] = raw-pause; fixedSum += raw-pause;
  }

  let computeError = null;
  if(computeIdx>-1){
    const mode = document.getElementById(`mode-${computeIdx}`).value;
    const neededNetto = targetMin - fixedSum;
    const startInput = document.getElementById(`start-${computeIdx}`);
    const endInput = document.getElementById(`end-${computeIdx}`);
    if(neededNetto < 0){ computeError = "Ziel überschritten"; nettoByDay[computeIdx] = 0; }
    else {
      let raw = neededNetto + (pauseEnabled? 30 : 0);
      if(pauseEnabled && raw <= 360) raw = neededNetto;
      if(!pauseEnabled) raw = neededNetto;
      nettoByDay[computeIdx] = raw - pauseFor(raw);
      if(mode==='end'){ const s = toMin(startInput.value); if(s!==null){ endInput.value = toTime(s+raw); } else { computeError = "Start fehlt"; } }
      else if(mode==='start'){ const e = toMin(endInput.value); if(e!==null){ startInput.value = toTime(e-raw); } else { computeError = "Ende fehlt"; } }
    }
  }

  for(let i=0;i<5;i++){
    const card = daysEl.children[i];
    const isComputed = i===computeIdx;
    card.classList.toggle('computed', isComputed);
    document.getElementById(`start-${i}`).disabled = isComputed && document.getElementById(`mode-${i}`).value==='start';
    document.getElementById(`end-${i}`).disabled = isComputed && document.getElementById(`mode-${i}`).value==='end';
    const s = toMin(document.getElementById(`start-${i}`).value);
    const e = toMin(document.getElementById(`end-${i}`).value);
    const nettoEl = document.getElementById(`netto-${i}`);
    const rawEl = document.getElementById(`raw-${i}`);
    const pauseEl = document.getElementById(`pause-${i}`);
    if(isComputed && computeError){ nettoEl.textContent = computeError; nettoEl.classList.add('zero'); rawEl.textContent = "Dauer –"; pauseEl.textContent = pauseEnabled? "Pause –" : "Pause aus"; continue; }
    if(s===null || e===null || e<=s){ nettoEl.textContent = "–"; nettoEl.classList.add('zero'); rawEl.textContent = "Dauer –"; pauseEl.textContent = pauseEnabled? "Pause –" : "Pause aus"; continue; }
    const raw = e-s; const pause = pauseFor(raw); const netto = raw-pause;
    nettoEl.textContent = fmtH(netto); nettoEl.classList.remove('zero');
    rawEl.textContent = "Dauer "+fmtH(raw);
    pauseEl.textContent = pause>0? "Pause 30min" : (pauseEnabled? "Pause –" : "Pause aus");
  }

  const totalNetto = nettoByDay.reduce((a,b)=>a+b,0);
  document.getElementById('sumTarget').textContent = fmtH(targetMin);
  document.getElementById('sumTotal').textContent = fmtH(totalNetto);
  document.getElementById('ringVal').textContent = Math.floor(totalNetto/60)+"h"+String(totalNetto%60).padStart(2,'0');
  const pct = targetMin>0? Math.max(0,Math.min(1,totalNetto/targetMin)) : 0;
  document.getElementById('gaugeArc').setAttribute('stroke-dashoffset', ARC_LEN*(1-pct));
  document.getElementById('needle').style.transform = `translateX(-50%) rotate(${pct*180-90}deg)`;
  document.getElementById('progressFill').style.width = (pct*100)+"%";
  const diff = totalNetto - targetMin;
  const diffTag = document.getElementById('diffTag');
  const gaugeArc = document.getElementById('gaugeArc');
  const progressFill = document.getElementById('progressFill');
  if(Math.abs(diff) < 1){ diffTag.textContent = "exakt am Ziel ✓"; diffTag.className = "stamp ok"; gaugeArc.setAttribute('stroke','#7ac4a0'); progressFill.style.background = '#7ac4a0'; }
  else if(diff>0){ diffTag.textContent = "+"+fmtH(diff)+" zu viel"; diffTag.className = "stamp over"; gaugeArc.setAttribute('stroke','#e08f85'); progressFill.style.background = '#e08f85'; }
  else { diffTag.textContent = fmtH(diff)+" zu wenig"; diffTag.className = "stamp under"; gaugeArc.setAttribute('stroke','#e0b877'); progressFill.style.background = '#e0b877'; }
}

function saveState(){
  const state = {target: targetEl.value, pause: pauseToggle.checked, days: []};
  for(let i=0;i<5;i++){ state.days.push({start: document.getElementById(`start-${i}`).value, end: document.getElementById(`end-${i}`).value, mode: document.getElementById(`mode-${i}`).value}); }
  try{ localStorage.setItem('stundenzettel-state-v2', JSON.stringify(state)); }catch(e){}
}
function loadState(){
  try{
    const raw = localStorage.getItem('stundenzettel-state-v2') || localStorage.getItem('stundenzettel-state');
    if(!raw) return false; const state = JSON.parse(raw);
    targetEl.value = state.target || "38.5";
    if(typeof state.pause === 'boolean') pauseToggle.checked = state.pause;
    if(state.days){ state.days.forEach((d,i)=>{ if(document.getElementById(`start-${i}`)){ document.getElementById(`start-${i}`).value = d.start; document.getElementById(`end-${i}`).value = d.end; document.getElementById(`mode-${i}`).value = d.mode; } }); }
    return true;
  }catch(e){ return false; }
}

build(); loadState(); recalc();
document.addEventListener('input', ()=>{ recalc(); saveState(); });
document.addEventListener('change', ()=>{ recalc(); saveState(); });
document.getElementById('resetBtn').addEventListener('click', ()=>{
  try{ localStorage.removeItem('stundenzettel-state-v2'); localStorage.removeItem('stundenzettel-state'); }catch(e){}
  location.reload();
});
