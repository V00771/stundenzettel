:root{
  color-scheme: dark;
  --bg:#0a0d0a;
  --paper:#0f1210;
  --card:#171d19;
  --card-hover:#1c2420;
  --line:#232e26;
  --line-soft:#2e3d32;
  --ink:#f2ece0;
  --ink-soft:#8da08d;
  --ink-faint:#5a6b5a;
  --steel:#7ac4a0;
  --steel-soft:#1a2e26;
  --stamp:#e07a6a;
  --mono:'JetBrains Mono',ui-monospace,monospace;
  --sans:'Inter',-apple-system,sans-serif;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html{background:var(--bg);}
body{
  margin:0;
  background:radial-gradient(120% 80% at 50% -20%, #1a2620 0%, var(--bg) 60%), var(--bg);
  color:var(--ink);
  font-family:var(--sans);
  padding:18px 16px 40px;
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:560px;margin:0 auto;}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
.eyebrow{font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-faint);font-weight:700;margin-bottom:6px;}
.eyebrow span{color:var(--ink-soft);}
h1{font-size:28px;font-weight:800;letter-spacing:-.03em;margin:0;color:var(--ink);}
#resetBtn{font-family:var(--mono);font-size:11px;font-weight:600;background:var(--card);border:1px solid var(--line);color:var(--ink-soft);border-radius:999px;padding:8px 16px;cursor:pointer;transition:.2s;}
#resetBtn:active{transform:scale(.96);background:var(--line);}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
@media(max-width:480px){.grid-2{grid-template-columns:1fr;}}
.target-row,.setting-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;transition:border-color.2s, background.2s;}
.target-row:focus-within{border-color:var(--line-soft);background:var(--card-hover);}
.target-row.txt b{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);font-weight:700;}
.target-row.txt span{font-size:11px;color:var(--ink-soft);}
.target-row input{width:86px;font-family:var(--mono);font-size:18px;font-weight:700;text-align:center;border:1.5px solid var(--line-soft);border-radius:10px;padding:8px;background:#0c130e;color:var(--ink);}
.setting-card{cursor:pointer;gap:12px;}
.setting-text b{display:block;font-size:12px;font-weight:700;letter-spacing:.02em;}
.setting-text span{display:block;font-size:10.5px;color:var(--ink-soft);margin-top:2px;line-height:1.3;}
.toggle-wrap{position:relative;width:46px;height:28px;flex-shrink:0;}
.toggle-wrap input{opacity:0;width:0;height:0;position:absolute;}
.toggle{position:absolute;inset:0;background:#222e26;border:1px solid var(--line-soft);border-radius:999px;transition:.3s;}
.toggle::after{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;background:var(--ink-soft);border-radius:50%;transition:.3s cubic-bezier(.34,1.56,.64,1);}
input:checked +.toggle{background:var(--steel-soft);border-color:var(--steel);}
input:checked +.toggle::after{background:var(--steel);transform:translateX(18px);}
.summary{background:linear-gradient(180deg, #1b2620, #151d19);border:1px solid var(--line);border-radius:20px;padding:18px;margin-bottom:18px;display:flex;align-items:center;gap:16px;overflow:hidden;}
.gauge-box{flex:0 0 160px;height:110px;position:relative;}
.gauge-box svg{position:absolute;top:0;left:0;}
.needle{position:absolute;left:50%;bottom:14px;width:2.5px;height:62px;background:linear-gradient(to top, var(--ink-faint), var(--ink));border-radius:2px;transform-origin:bottom center;transform:translateX(-50%) rotate(-90deg);transition:transform.6s cubic-bezier(.34,1.4,.64,1);}
.needle::after{content:"";position:absolute;left:50%;bottom:-5px;width:10px;height:10px;background:var(--ink);border-radius:50%;transform:translateX(-50%);box-shadow:0 0 0 4px rgba(242,236,224,.12);}
.gauge-readout{position:absolute;left:0;right:0;bottom:4px;text-align:center;}
.gauge-readout.val{font-family:var(--mono);font-size:20px;font-weight:800;letter-spacing:-.02em;}
.gauge-readout.lbl{font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-soft);margin-top:2px;}
.summary-info{flex:1;min-width:0;}
.summary-info.row{display:flex;justify-content:space-between;font-family:var(--mono);font-size:11.5px;color:var(--ink-soft);margin-bottom:8px;}
.summary-info.row span:last-child{color:var(--ink);font-weight:700;}
.diff-wrap{margin-top:10px;}
.stamp{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.04em;display:inline-flex;padding:6px 12px;border-radius:999px;border:1px solid currentColor;}
.stamp.ok{background:rgba(122,196,160,.15);color:#7ac4a0;border-color:rgba(122,196,160,.3);}
.stamp.over{background:rgba(224,122,106,.12);color:#e08f85;border-color:rgba(224,122,106,.25);}
.stamp.under{background:rgba(224,184,119,.12);color:#e0b877;border-color:rgba(224,184,119,.25);}
.progress-track{height:4px;background:rgba(255,255,255,.06);border-radius:999px;margin-top:12px;overflow:hidden;}
.progress-fill{height:100%;width:0%;background:var(--steel);border-radius:999px;transition:width.6s ease, background.3s;}
.day-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px;margin-bottom:10px;transition:.2s;}
.day-card:active{transform:scale(.99);}
.day-card.computed{border-color:rgba(122,196,160,.4);background:linear-gradient(180deg, #1d2a23, #171d19);box-shadow:0 0 0 1px rgba(122,196,160,.15), 0 8px 24px rgba(0,0,0,.3);}
.day-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.day-name-wrap{display:flex;align-items:center;gap:10px;}
.day-name{font-weight:800;font-size:15px;letter-spacing:-.01em;}
.badge-active{font-family:var(--mono);font-size:9px;letter-spacing:.08em;text-transform:uppercase;background:var(--steel-soft);color:var(--steel);border:1px solid rgba(122,196,160,.25);padding:3px 8px;border-radius:999px;opacity:0;transition:.2s;}
.day-card.computed.badge-active{opacity:1;}
.day-netto{font-family:var(--mono);font-size:15px;font-weight:800;}
.day-netto.zero{color:var(--ink-faint);font-weight:500;}
.row-inputs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
@media(max-width:480px){.row-inputs{grid-template-columns:1fr 1fr;}.row-inputs.mode-select{grid-column:1 / -1;}}
.field label,.mode-select label{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint);font-weight:700;margin-bottom:6px;display:block;}
.field input[type=time],.mode-select select{width:100%;height:42px;font-family:var(--mono);font-size:15px;font-weight:600;border:1px solid var(--line-soft);border-radius:12px;padding:0 12px;background:#0c130e;color:var(--ink);color-scheme:dark;transition:.15s;}
.field input:focus,.mode-select select:focus{outline:none;border-color:var(--steel);box-shadow:0 0 0 3px rgba(122,196,160,.15);}
.field input[disabled]{opacity:.6;background:var(--steel-soft);border-color:rgba(122,196,160,.3);font-weight:800;color:var(--steel);}
.mode-select select{appearance:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%238da08d' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;}
.meta-line{display:flex;gap:14px;margin-top:12px;padding-top:12px;border-top:1px dashed var(--line);font-family:var(--mono);font-size:11px;color:var(--ink-faint);}
.note{display:flex;gap:10px;font-size:11.5px;line-height:1.5;color:var(--ink-soft);background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;margin-top:20px;}
.note.dot{width:6px;height:6px;background:var(--steel);border-radius:50%;margin-top:6px;flex-shrink:0;box-shadow:0 0 8px var(--steel);}
.note b{color:var(--ink);}
