(() => {
  const num = (v) => {
    const n = parseFloat(String(v ?? '').trim().replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const ageRows = [
    {m:0,w:3.5,h:49.5,hr:'130–180',sbp:'>50',rr:'40–60',unc:'2,5–3,0',cuf:'–',oral:'6 + kg KG',nasal:'8–10',lma:'1',vent:'40–60/min'},
    {m:0.1,w:3.5,h:50,hr:'120–170',sbp:'60–80',rr:'40–60',unc:'3,0–3,5',cuf:'–',oral:'9–10',nasal:'11–12',lma:'1',vent:'30–40/min'},
    {m:2,w:4.5,h:57,hr:'120–170',sbp:'60–80',rr:'25–40',unc:'3,0–3,5',cuf:'3,0',oral:'10–11',nasal:'12–13',lma:'1',vent:'30–40/min'},
    {m:6,w:7,h:67,hr:'100–150',sbp:'70–110',rr:'25–40',unc:'3,5–4,0',cuf:'3,5',oral:'11',nasal:'13',lma:'1½',vent:'25–30/min'},
    {m:12,w:10,h:75.5,hr:'100–150',sbp:'70–110',rr:'25–40',unc:'4,0',cuf:'3,5–4,0',oral:'12',nasal:'14',lma:'1½–2',vent:'25–30/min'},
    {m:18,w:12,h:82,hr:'100–150',sbp:'70–110',rr:'25–40',unc:'4,0–4,5',cuf:'3,5–4,0',oral:'13',nasal:'15',lma:'2',vent:'20–25/min'},
    {m:24,w:14,h:87,hr:'80–130',sbp:'>94',rr:'20–30',unc:'4,0–4,5',cuf:'4,0',oral:'13',nasal:'15',lma:'2',vent:'20–25/min'},
    {m:48,w:17,h:103.5,hr:'80–130',sbp:'>98',rr:'20–30',unc:'5,0',cuf:'4,5',oral:'14',nasal:'17',lma:'2',vent:'18–22/min'},
    {m:72,w:21,h:116,hr:'70–110',sbp:'>102',rr:'20–25',unc:'5,5',cuf:'5,0',oral:'15',nasal:'18',lma:'2½',vent:'18–22/min'},
    {m:96,w:25,h:128,hr:'70–110',sbp:'>106',rr:'20–25',unc:'6,0',cuf:'5,5',oral:'16',nasal:'20',lma:'2½',vent:'16–20/min'},
    {m:120,w:31,h:138,hr:'70–110',sbp:'>110',rr:'20–25',unc:'6,5',cuf:'6,0',oral:'18',nasal:'22',lma:'3',vent:'16–20/min'},
    {m:144,w:40,h:150,hr:'60–100',sbp:'>114',rr:'12–20',unc:'7,0',cuf:'6,5',oral:'20',nasal:'24',lma:'3–4',vent:'16–20/min'}
  ];

  const months = () => {
    const v = num(document.getElementById('ageValue')?.value);
    return document.getElementById('ageUnit')?.value === 'months' ? v : v * 12;
  };
  const nearest = (m) => ageRows.reduce((a,b) => Math.abs(b.m-m) < Math.abs(a.m-m) ? b : a);
  const interp = (m,key) => {
    if (m <= ageRows[0].m) return ageRows[0][key];
    const last = ageRows[ageRows.length-1];
    if (m >= last.m) return last[key];
    let i = ageRows.findIndex(r => r.m >= m);
    const a = ageRows[i-1], b = ageRows[i];
    if (typeof a[key] !== 'number' || typeof b[key] !== 'number') return nearest(m)[key];
    return a[key] + (b[key]-a[key]) * (m-a.m)/(b.m-a.m);
  };
  const fmt = (n,d=1) => Number(n).toLocaleString('de-DE',{maximumFractionDigits:d});
  const lma = (kg) => kg < 5 ? '1' : kg < 10 ? '1½' : kg < 20 ? '2' : kg < 30 ? '2½' : kg < 50 ? '3' : '4';

  const fallbackUpdate = () => {
    const m = months();
    const r = nearest(m);
    const ew = interp(m,'w');
    const eh = interp(m,'h');
    const weightInput = document.getElementById('actualWeight');
    if (weightInput && !weightInput.dataset.edited) weightInput.value = ew.toFixed(1);
    const kg = num(weightInput?.value) || ew;
    const set = (id,val) => { const e=document.getElementById(id); if(e) e.textContent=val; };
    set('estWeight',fmt(ew)); set('estHeight',fmt(eh));
    set('tubeKpi',r.cuf); set('lmaKpi',lma(kg));
    set('hr',r.hr); set('sbp',r.sbp); set('rr',r.rr); set('bultWeight',fmt(ew));
    set('tubeUncuffed',r.unc+' mm ID'); set('tubeCuffed',r.cuf+' mm ID');
    set('tubeDepthOral',r.oral+' cm'); set('tubeDepthNasal',r.nasal+' cm');
    set('lma','Größe '+lma(kg)); set('vt',`${fmt(6*kg,0)}–${fmt(10*kg,0)} ml (6–10 ml/kg)`); set('ventFreq',r.vent);
    if (typeof window.renderMeds === 'function') window.renderMeds(kg);
    if (typeof window.renderFluids === 'function') window.renderFluids(kg);
    if (typeof window.renderCurrentEmergency === 'function') window.renderCurrentEmergency(m,kg);
  };

  const recalc = () => {
    try {
      if (typeof window.update === 'function') window.update();
      else fallbackUpdate();
    } catch (e) {
      console.error('QuickRef update fallback', e);
      fallbackUpdate();
    }
  };

  const age = document.getElementById('ageValue');
  const unit = document.getElementById('ageUnit');
  const weight = document.getElementById('actualWeight');
  [age, unit].filter(Boolean).forEach(el => ['input','change','keyup','blur'].forEach(ev => el.addEventListener(ev, () => {
    if (weight) weight.dataset.edited = '';
    recalc();
  })));
  if (weight) ['input','change','keyup','blur'].forEach(ev => weight.addEventListener(ev, () => { weight.dataset.edited='1'; recalc(); }));

  document.querySelectorAll('.quick button').forEach(btn => btn.addEventListener('click', () => setTimeout(recalc,0)));

  let calcBtn = document.getElementById('calculateBtn');
  if (!calcBtn && age) {
    calcBtn = document.createElement('button');
    calcBtn.id='calculateBtn';
    calcBtn.textContent='Alle Werte neu berechnen';
    calcBtn.style.marginTop='10px';
    age.closest('.row')?.after(calcBtn);
  }
  if (calcBtn) calcBtn.addEventListener('click', recalc);

  recalc();
})();
