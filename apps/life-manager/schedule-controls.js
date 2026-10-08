/* Life Manager weekly finish-time + sleep display controls — loop-safe */
(() => {
  const WEEK_KEY='kb-life-manager-week-v2';
  const WORK_HOURS={night:12,early:12,day:8,late:8};

  function mins(t){if(!t)return 0;const [h,m]=t.split(':').map(Number);return h*60+m;}
  function clock(n){n=((n%1440)+1440)%1440;return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
  function load(){try{return JSON.parse(localStorage.getItem(WEEK_KEY))||{}}catch{return {}}}
  function save(v){localStorage.setItem(WEEK_KEY,JSON.stringify(v));}
  function defaultFinish(key,start){return WORK_HOURS[key]?clock(mins(start)+WORK_HOURS[key]*60):'';}
  function sleepHours(){return 7.5;}

  function enhance(){
    const box=document.querySelector('#modeChooser');
    if(!box||!box.querySelector('.week-day'))return;
    const week=load();

    box.querySelectorAll('.week-day').forEach(card=>{
      const date=card.dataset.weekDate;
      const select=card.querySelector('.week-template');
      const start=card.querySelector('.week-anchor');
      if(!select||!start)return;

      let finish=card.querySelector('.week-finish');
      if(!finish){
        const label=document.createElement('label');
        label.className='week-finish-wrap';
        label.innerHTML='<span>Work finishes</span><input class="week-finish" type="time">';
        start.closest('label')?.after(label);
        finish=label.querySelector('.week-finish');
      }
      let sleep=card.querySelector('.week-sleep');
      if(!sleep){sleep=document.createElement('div');sleep.className='week-sleep';card.appendChild(sleep);}

      const sync=(resetFinish=false)=>{
        const key=select.value;
        const isWork=!!WORK_HOURS[key];
        const saved=load()[date]||{};
        finish.closest('.week-finish-wrap').hidden=!isWork;
        if(isWork && (resetFinish||!finish.value)) finish.value=resetFinish?defaultFinish(key,start.value):(saved.finish||defaultFinish(key,start.value));
        if(!isWork) finish.value='';
        sleep.textContent=`Sleep: ${sleepHours()} hrs`;
      };

      if(!card.dataset.finishControlsBound){
        card.dataset.finishControlsBound='1';
        select.addEventListener('change',()=>sync(true));
        start.addEventListener('change',()=>{if(WORK_HOURS[select.value])finish.value=defaultFinish(select.value,start.value);});
      }
      sync(false);
    });

    const apply=document.querySelector('#applyWeek');
    if(apply&&!apply.dataset.finishHook){
      apply.dataset.finishHook='1';
      apply.addEventListener('click',()=>{
        const week=load();
        box.querySelectorAll('.week-day').forEach(card=>{
          const date=card.dataset.weekDate;
          week[date]=week[date]||{};
          const f=card.querySelector('.week-finish');
          if(f&&f.value&&!f.closest('.week-finish-wrap').hidden)week[date].finish=f.value;
          else delete week[date].finish;
        });
        save(week);
      },true);
    }

    const one=document.querySelector('#useTodayOnly');
    if(one&&!one.dataset.finishHook){
      one.dataset.finishHook='1';
      one.addEventListener('click',()=>{
        const card=box.querySelector('.week-day.selected')||box.querySelector(`[data-week-date="${window.selectedDate||''}"]`);
        if(!card)return;
        const week=load(),date=card.dataset.weekDate;
        week[date]=week[date]||{};
        const f=card.querySelector('.week-finish');
        if(f&&f.value&&!f.closest('.week-finish-wrap').hidden)week[date].finish=f.value;
        else delete week[date].finish;
        save(week);
      },true);
    }
  }

  // schedule-v2 rebuilds the chooser when it is opened. Hook user interaction and
  // run a few bounded initialisation passes instead of observing our own DOM writes.
  document.addEventListener('DOMContentLoaded',()=>{
    enhance();
    setTimeout(enhance,50);
    setTimeout(enhance,250);
    setTimeout(enhance,750);
    document.querySelector('#modeChooser')?.addEventListener('click',()=>setTimeout(enhance,0));
  });

  const style=document.createElement('style');
  style.textContent='.week-finish-wrap{display:grid;gap:4px;font-size:.72rem}.week-finish-wrap[hidden]{display:none}.week-sleep{margin-top:2px;padding:7px 8px;border-radius:9px;background:rgba(117,167,255,.10);font-size:.74rem;font-weight:700;white-space:nowrap}';
  document.head.appendChild(style);
})();
