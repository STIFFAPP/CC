/* Life Manager: work-finish control + calculated sleep display. */
(() => {
  const WEEK_KEY = 'kb-life-manager-week-v2';
  const workMinutes = { night:720, early:720, day:480, late:480 };
  const baseGetTasks = getTasks;
  const mins = t => { const [h,m]=(t||'00:00').split(':').map(Number); return h*60+m; };
  const clock = n => { n=((n%1440)+1440)%1440; return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0'); };
  const delta = (a,b) => { let d=mins(a)-mins(b); if(d>720)d-=1440; if(d<-720)d+=1440; return d; };
  const readWeek = () => { try{return JSON.parse(localStorage.getItem(WEEK_KEY))||{}}catch{return{}} };
  const writeWeek = w => localStorage.setItem(WEEK_KEY,JSON.stringify(w));
  const sleepHours = tasks => tasks.reduce((sum,t)=>{ if(!/sleep/i.test(t[2]||'')) return sum; let d=mins(t[1])-mins(t[0]); if(d<=0)d+=1440; return sum+d; },0)/60;

  getTasks = function(day){
    let tasks = baseGetTasks(day);
    if(!day?.template || !workMinutes[day.template] || !day.actualFinish) return tasks;
    const plannedEnd = clock(mins(day.anchor||'00:00') + workMinutes[day.template]);
    const shift = delta(day.actualFinish, plannedEnd);
    if(!shift) return tasks;
    const endM = mins(plannedEnd);
    return tasks.map(t=>{
      if(/work/i.test(t[2]||'')) return [t[0],day.actualFinish,t[2],t[3],t[4]];
      const s=mins(t[0]);
      const after = ((s-endM+1440)%1440) < 720;
      return after ? [clock(s+shift),clock(mins(t[1])+shift),t[2],t[3],t[4]] : t;
    });
  };

  function enhancePlanner(){
    document.querySelectorAll('.week-day').forEach(card=>{
      const key=card.querySelector('.week-template')?.value;
      const anchor=card.querySelector('.week-anchor')?.value;
      if(!key||!anchor) return;
      let finish=card.querySelector('.week-finish');
      let sleep=card.querySelector('.sleep-total');
      const date=card.dataset.weekDate;
      const week=readWeek();
      if(workMinutes[key]){
        if(!finish){
          const label=document.createElement('label'); label.className='finish-setting';
          label.innerHTML='<span>Work finishes</span><input class="week-finish" type="time">';
          card.querySelector('label')?.after(label); finish=label.querySelector('input');
        }
        finish.value=week[date]?.finish || clock(mins(anchor)+workMinutes[key]);
      } else card.querySelector('.finish-setting')?.remove();
      if(!sleep){ sleep=document.createElement('div'); sleep.className='sleep-total'; card.appendChild(sleep); }
      const fake={template:key,anchor,actualFinish:finish?.value||null};
      sleep.textContent=`Sleep: ${sleepHours(getTasks(fake)).toFixed(1).replace('.0','')} hrs`;
      const refresh=()=>{ const f=card.querySelector('.week-finish'); const fake2={template:card.querySelector('.week-template').value,anchor:card.querySelector('.week-anchor').value,actualFinish:f?.value||null}; sleep.textContent=`Sleep: ${sleepHours(getTasks(fake2)).toFixed(1).replace('.0','')} hrs`; };
      card.querySelectorAll('select,input').forEach(el=>{ if(!el.dataset.sleepBound){el.dataset.sleepBound='1';el.addEventListener('change',()=>setTimeout(()=>{enhancePlanner();refresh()},0));} });
    });
  }

  function saveFinishSettings(){
    const week=readWeek();
    document.querySelectorAll('.week-day').forEach(card=>{
      const date=card.dataset.weekDate, f=card.querySelector('.week-finish');
      if(!date||!f) return;
      week[date]=week[date]||{}; week[date].finish=f.value;
      const old=selectedDate; selectedDate=date; const d=dayState(); d.actualFinish=f.value; saveState(); selectedDate=old;
    });
    writeWeek(week);
  }

  document.addEventListener('click',e=>{
    if(e.target?.id==='applyWeek'||e.target?.id==='useTodayOnly') setTimeout(()=>{saveFinishSettings(); renderAll();},0);
  },true);

  const observer=new MutationObserver(()=>enhancePlanner());
  document.addEventListener('DOMContentLoaded',()=>{
    const chooser=document.querySelector('#modeChooser'); if(chooser) observer.observe(chooser,{childList:true,subtree:true});
    setTimeout(enhancePlanner,50);
    const warning=document.querySelector('#sleepWarning'); if(warning) warning.remove();
    const finishCard=document.querySelector('#finishCard'); if(finishCard) finishCard.remove();
  });

  const previousRenderToday=renderToday;
  renderToday=function(){
    const w=readWeek(), saved=w[selectedDate];
    if(saved?.finish){ const d=dayState(); d.actualFinish=saved.finish; }
    previousRenderToday();
    const d=dayState();
    if(d.template){
      let badge=document.querySelector('#dailySleepTotal');
      if(!badge){badge=document.createElement('div');badge.id='dailySleepTotal';badge.className='daily-sleep-total';document.querySelector('#routineHeading')?.after(badge);}
      badge.textContent=`Calculated sleep: ${sleepHours(getTasks(d)).toFixed(1).replace('.0','')} hours`;
    }
  };

  const style=document.createElement('style');
  style.textContent='.finish-setting{margin-top:2px}.sleep-total{font-weight:800;font-size:.78rem;padding:7px 9px;border-radius:10px;background:rgba(117,167,255,.12);text-align:center}.daily-sleep-total{margin-top:5px;font-size:.82rem;font-weight:800;opacity:.82}';
  document.head.appendChild(style);
})();