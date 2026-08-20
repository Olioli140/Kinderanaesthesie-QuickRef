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
    const target=q('vitalCards'), body=q('vitalTable'); if(!target || !body) return;
    const rows=[...body.querySelectorAll('tr')];
    target.innerHTML=rows.map(tr=>{
      const c=[...tr.children].map(td=>td.textContent.trim());
      return `<div class="mobile-card"><h4>${c[0]||''}</h4><div class="mobile-kv"><div class="mobile-label">Herzfrequenz</div><div class="mobile-value">${c[1]||'–'}</div><div class="mobile-label">syst. RR</div><div class="mobile-value">${c[2]||'–'}</div><div class="mobile-label">Atemfrequenz</div><div class="mobile-value">${c[3]||'–'}</div><div class="mobile-label">typisches KG</div><div class="mobile-value">${c[4]||'–'} kg</div></div></div>`;
    }).join('');
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
    const obs=new MutationObserver(()=>render());
    const body=q('vitalTable'); if(body) obs.observe(body,{childList:true,subtree:true,characterData:true});
    ['tubeUncuffed','tubeCuffed','tubeDepthOral','tubeDepthNasal','lma','vt','ventFreq'].forEach(id=>{const el=q(id);if(el)obs.observe(el,{childList:true,subtree:true,characterData:true});});
  });
})();
