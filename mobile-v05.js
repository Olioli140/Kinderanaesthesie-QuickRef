(() => {
  const q = (id) => document.getElementById(id);
  const ensureContainers = () => {
    const normals = q('normals');
    if (normals && !q('vitalCards')) {
      const d = document.createElement('div'); d.id='vitalCards'; d.className='mobile-cards';
      const t = normals.querySelector('table'); if (t) t.insertAdjacentElement('afterend', d);
    }
    const airway = q('airway');
    if (airway && !q('airwayCards')) {
      const d = document.createElement('div'); d.id='airwayCards'; d.className='mobile-cards';
      const t = airway.querySelector('table'); if (t) t.insertAdjacentElement('afterend', d);
    }
  };
  const renderVitalsMobile = () => {
    const target=q('vitalCards'); if(!target || !window.vitalRows) return;
    target.innerHTML=window.vitalRows.map(r=>`<div class="mobile-card"><h4>${r.label}</h4><div class="mobile-kv"><div class="mobile-label">Herzfrequenz</div><div class="mobile-value">${r.hr}</div><div class="mobile-label">syst. RR</div><div class="mobile-value">${r.sbp}</div><div class="mobile-label">Atemfrequenz</div><div class="mobile-value">${r.rr}</div><div class="mobile-label">typisches KG</div><div class="mobile-value">${r.w} kg</div></div></div>`).join('');
  };
  const renderAirwayMobile = () => {
    const target=q('airwayCards'); if(!target) return;
    const get=(id)=>q(id)?.textContent||'–';
    const rows=[['ETT ohne Cuff',get('tubeUncuffed')],['ETT mit Cuff',get('tubeCuffed')],['Tubustiefe oral',get('tubeDepthOral')],['Tubustiefe nasal',get('tubeDepthNasal')],['Larynxmaske',get('lma')],['Atemzugvolumen',get('vt')],['Beatmungsfrequenz',get('ventFreq')],['PEEP','3–5 mbar'],['Paw','13–20 mbar'],['I:E','1:1,5–3,0']];
    target.innerHTML=rows.map(([k,v])=>`<div class="mobile-card"><div class="mobile-kv"><div class="mobile-label">${k}</div><div class="mobile-value">${v}</div></div></div>`).join('');
  };
  const render=()=>{ensureContainers();renderVitalsMobile();renderAirwayMobile();};
  document.addEventListener('DOMContentLoaded',()=>{
    render();
    const age=q('ageValue'), unit=q('ageUnit'), weight=q('actualWeight');
    [age,unit,weight].filter(Boolean).forEach(el=>['input','change','blur'].forEach(ev=>el.addEventListener(ev,()=>setTimeout(render,0))));
    document.querySelectorAll('.quick button').forEach(b=>b.addEventListener('click',()=>setTimeout(render,0)));
    const title=document.querySelector('h1'); if(title) title.innerHTML=title.innerHTML.replace(/iPhone v0\.3|iPhone v0\.4/g,'iPhone v0.5');
    document.title=document.title.replace(/v0\.3|v0\.4/g,'v0.5');
  });
})();
