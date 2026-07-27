const DAYS = [
  { id:'mo', label:'Montag', short:'Mo' },
  { id:'di', label:'Dienstag', short:'Di' },
  { id:'mi', label:'Mittwoch', short:'Mi' },
  { id:'do', label:'Donnerstag', short:'Do' },
  { id:'fr', label:'Freitag', short:'Fr' },
  { id:'sa', label:'Samstag', short:'Sa' },
  { id:'so', label:'Sonntag', short:'So' },
];
const DEFAULTS = {
  mo:{ start:'08:00', end:'16:30', on:true },
  di:{ start:'08:00', end:'16:30', on:true },
  mi:{ start:'08:00', end:'16:30', on:true },
  do:{ start:'08:00', end:'16:30', on:true },
  fr:{ start:'08:00', end:'15:00', on:true },
  sa:{ start:'', end:'', on:false },
  so:{ start:'', end:'', on:false },
};

const els = {};
function $(id){ return document.getElementById(id); }

function toMin(t){
  if(!t || !t.includes(':')) return NaN;
  const [h,m] = t.split(':').map(Number);
  if(Number.isNaN(h)||Number.isNaN(m)) return NaN;
  return h*60+m;
}
function toTime(min){
  const h = Math.floor(min/60);
  const m = min%60;
  return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
}
function fmtH(min){
  if(min<=0||Number.isNaN(min)) return '0h00';
  const h = Math.floor(min/60);
  const m = min%60;
  return h+'h'+String(m).padStart(2,'0');
}
function pauseFor(total){
  return total > 360 ? 30 : 0;
}
function weekNumber(d=new Date()){
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay()||7;
  date.setUTCDate(date.getUTCDate()+4-dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date - yearStart)/86400000)+1)/7);
}
function build(){
  els.days = $('days');
  els.target = $('target');
  els.kwNum = $('kwNum');
  els.ringVal = $('ringVal');
  els.sumTarget = $('sumTarget');
  els.sumTotal = $('sumTotal');
  els.diffTag = $('diffTag');
  els.gaugeArc = $('gaugeArc');
  els.needle = $('needle');
  els.resetBtn = $('resetBtn');

  els.kwNum.textContent = weekNumber();

  const frag = document.createDocumentFragment();
  DAYS.forEach(d=>{
    const row = document.createElement('div');
    row.className='day';
    row.dataset.id=d.id;
    row.innerHTML = `
      <div class="dow"><span>${d.short}</span><b>${d.label.slice(0,2)}</b></div>
      <div class="inputs">
        <input type="time" data-k="start" aria-label="Start ${d.label}">
        <span class="dash">—</span>
        <input type="time" data-k="end" aria-label="Ende ${d.label}">
        <label class="check"><input type="checkbox" data-k="on"> aktiv</label>
      </div>
      <div class="meta"><div class="net" data-k="net">–</div><div class="sub" data-k="sub">–</div></div>
    `;
    frag.appendChild(row);
  });
  els.days.appendChild(frag);

  els.days.addEventListener('input', e=>{
    if(e.target.matches('input')) recalc();
  });
  els.days.addEventListener('change', e=>{
    if(e.target.matches('input')) recalc();
  });
  els.target.addEventListener('input', recalc);
  els.resetBtn.addEventListener('click', ()=>{
    localStorage.removeItem('wochenkarte:v2');
    loadState(true);
    recalc();
  });

  loadState();
  recalc();
}

function getDayState(id){
  const row = document.querySelector(`.day[data-id="${id}"]`);
  const start = row.querySelector('[data-k="start"]').value;
  const end = row.querySelector('[data-k="end"]').value;
  const on = row.querySelector('[data-k="on"]').checked;
  return { start, end, on };
}
function setDayState(id, s){
  const row = document.querySelector(`.day[data-id="${id}"]`);
  row.querySelector('[data-k="start"]').value = s.start||'';
  row.querySelector('[data-k="end"]').value = s.end||'';
  row.querySelector('[data-k="on"]').checked = !!s.on;
  row.classList.toggle('is-off', !s.on);
}

function recalc(){
  let totalNet = 0;
  let activeDays = 0;
  DAYS.forEach(d=>{
    const row = document.querySelector(`.day[data-id="${d.id}"]`);
    const { start, end, on } = getDayState(d.id);
    row.classList.toggle('is-off', !on);
    const netEl = row.querySelector('[data-k="net"]');
    const subEl = row.querySelector('[data-k="sub"]');
    if(!on || !start || !end){
      netEl.textContent = '–';
      subEl.textContent = on ? 'keine Zeit' : 'frei';
      return;
    }
    const s = toMin(start), e = toMin(end);
    if(Number.isNaN(s)||Number.isNaN(e)||e<=s){
      netEl.textContent = '–';
      subEl.textContent = 'ungültig';
      return;
    }
    const brutto = e - s;
    const pause = pauseFor(brutto);
    const netto = brutto - pause;
    totalNet += netto;
    activeDays++;
    netEl.textContent = fmtH(netto);
    subEl.textContent = brutto>360 ? `inkl. ${pause}m Pause` : `${brutto}m brutto`;
  });

  const targetH = parseFloat(els.target.value)||0;
  const targetM = Math.round(targetH*60);
  els.sumTarget.textContent = fmtH(targetM);
  els.sumTotal.textContent = fmtH(totalNet);
  els.ringVal.textContent = fmtH(totalNet);

  const diff = totalNet - targetM;
  const pct = targetM>0 ? totalNet/targetM : 0;
  const clamped = Math.max(0, Math.min(1.2, pct));
  const dash = 188.5;
  const offset = dash - (Math.min(clamped,1)*dash);
  els.gaugeArc.style.strokeDashoffset = String(offset);
  els.needle.style.transform = `translateX(-50%) rotate(${-90 + clamped*180}deg)`;
  els.gaugeArc.setAttribute('stroke', pct>=1 ? 'var(--ok)' : pct>=0.6 ? 'var(--accent)' : 'var(--ink-faint)');

  let tagText = '';
  let tagClass = 'stamp ';
  if(diff===0) { tagText = 'exakt am Ziel'; tagClass+='ok'; }
  else if(diff>0){ tagText = '+' + fmtH(diff)+' über Ziel'; tagClass+= diff>60 ? 'ok':'mid'; }
  else { tagText = fmtH(Math.abs(diff))+' unter Ziel'; tagClass+= Math.abs(diff)<60 ? 'mid':'low'; }
  els.diffTag.textContent = tagText;
  els.diffTag.className = tagClass;

  saveState();
}

function saveState(){
  const data = {
    target: els.target.value,
    days: {}
  };
  DAYS.forEach(d=> data.days[d.id]=getDayState(d.id));
  localStorage.setItem('wochenkarte:v2', JSON.stringify(data));
}
function loadState(reset=false){
  let raw = null;
  if(!reset){
    try{ raw = JSON.parse(localStorage.getItem('wochenkarte:v2')||''); }catch{ raw=null; }
  }
  const src = raw || { target:'38.5', days: DEFAULTS };
  els.target.value = src.target ?? '38.5';
  DAYS.forEach(d=>{
    const st = (src.days && src.days[d.id]) || DEFAULTS[d.id];
    setDayState(d.id, st);
  });
}

document.addEventListener('DOMContentLoaded', build);