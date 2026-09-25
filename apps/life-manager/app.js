const APP_KEY = 'kb-life-manager-v1';

const normalTasks = [
  ['03:50','03:55','WAKE',['Get straight out of bed','Lights on','Drink water','No scrolling']],
  ['03:55','04:05','MEDITATION',[]],
  ['04:05','04:35','BELLA MORNING WALK',['Toilet','Proper walk','Do not rush her'],'Bella’s care is non-negotiable.'],
  ['04:35','04:45','BELLA FOOD + WATER',['Give Bella first food','Check/refill fresh water']],
  ['04:45','05:00','SHOWER + DRESS',['Shower','Hygiene','Get dressed']],
  ['05:00','05:20','BREAKFAST + WATER',[]],
  ['05:20','05:25','MINOXIDIL',[],'Only when appropriate under your separate treatment schedule.'],
  ['05:25','05:30','FINAL WORK CHECK',['Keys','Wallet','Phone','Food','Water','Work equipment','Gym clothes/equipment']],
  ['05:30','06:00','COMMUTE TO WORK',[]],
  ['06:00','18:00','WORK',[],'Expected finish is 18:00 or later.'],
  ['18:00','18:30','COMMUTE HOME',[]],
  ['18:30','19:00','BELLA EVENING WALK',['Toilet','Proper walk','Do not rush her'],'Never rush or skip Bella’s care to make the gym.'],
  ['19:00','19:10','BELLA FOOD + WATER',['Give Bella second food','Check/refill fresh water']],
  ['19:10','19:30','PRE-GYM FOOD + WATER',[]],
  ['19:30','19:45','GET READY / TRAVEL TO GYM',[]],
  ['19:45','21:15','GYM — 90 MINUTES',[],'Keep the full 90 minutes.'],
  ['21:15','21:30','TRAVEL HOME',[]],
  ['21:30','21:45','QUICK SHOWER + CHANGE',[]],
  ['21:45','22:00','POST-GYM MEAL + WATER',[]],
  ['22:00','22:10','PREPARE TOMORROW',['Work clothes','Food','Water','Keys/wallet','Work equipment','Alarm']],
  ['22:10','22:11','SLEEP',[],'Go directly to sleep. Do not add catch-up tasks.']
];

const nightTasks = [
  ['17:40','17:45','WAKE + WATER',['Get out of bed','Lights on','Drink water','No scrolling']],
  ['17:45','17:55','MEDITATION',[]],
  ['17:55','18:25','BELLA EVENING WALK',['Toilet','Proper walk','Do not rush her'],'Bella’s care is non-negotiable.'],
  ['18:25','18:35','BELLA FOOD + WATER',['Give Bella second food','Check/refill fresh water']],
  ['18:35','18:55','PRE-GYM FOOD + WATER',[]],
  ['18:55','19:30','GET READY / TRAVEL TO GYM',[]],
  ['19:30','21:00','GYM — 90 MINUTES',[],'Keep the full 90 minutes. Do not shorten it to fit optional tasks.'],
  ['21:00','21:30','SHOWER + POST-GYM FOOD',[]],
  ['21:30','22:00','COMMUTE TO WORK',[]],
  ['22:00','10:00','WORK — NIGHT SHIFT',[],'Expected finish is 10:00 or later.'],
  ['10:00','10:30','COMMUTE HOME',[]],
  ['10:30','11:00','BELLA MORNING WALK',['Toilet','Proper walk','Do not rush her'],'Move this with your actual arrival time. Never delete it.'],
  ['11:00','11:10','BELLA FOOD + WATER',['Give Bella first food','Check/refill fresh water']],
  ['11:10','11:25','SHOWER + HYGIENE',[]],
  ['11:25','11:45','MEAL + WATER',[]],
  ['11:45','12:00','PREPARE FOR SLEEP',['Wind down','Darken room','Put phone on sleep/do-not-disturb']],
  ['12:00','12:01','SLEEP',[],'Protect sleep. Do not add Eden GMC, admin, YouTube, push-ups or optional productivity.']
];

const routines = {
  reset: { title:"RESET — DON'T THINK", duration:30, featured:true, note:'DO NOT CATCH UP. DO NOT WAIT FOR TOMORROW. REJOIN THE DAY FROM WHERE I AM NOW.', items:['Stand up','Turn the lights on/open curtains','Drink water','Wash face and brush teeth','Leave bedroom for at least 5 minutes','Five-minute room reset','Open this app','Look at what should be happening NOW','Ignore missed tasks','Choose ONE useful task','Identify the smallest physical action','Work on it for five minutes'] },
  minimum: { title:'MINIMUM DAY', note:'The goal is not productivity. The goal is preventing a difficult day from becoming a zero day.', items:['Get out of bed','Lights/curtains open','Drink water','Brush teeth','Shower/wash','Put clean clothes on','Eat a proper meal','STIFF minimum session','Go outside for 10 minutes where possible','Complete ONE important task','Spend some time outside my bedroom','Speak to or interact with another person where possible','Prepare for sleep'] },
  start: { title:'JUST START', duration:10, note:'ACTION BEFORE MOTIVATION.', items:['What am I avoiding?','What is the actual outcome?','What is the next PHYSICAL action?','Make that action smaller if necessary','Set a five-minute timer','Start','After five minutes: continue, take a planned break, or schedule the next action'] }
};

const business = {
  prep: { title:'EDEN GMC — WEEKEND JOB PREP', duration:45, note:'Friday recurring preparation.', items:['Confirm Saturday customers','Confirm Sunday customers','Confirm times','Confirm addresses','Check weather','Plan route','Check equipment','Fuel/charge equipment','Prepare chemicals/materials','Prepare garden tools','Prepare PPE/workwear','Send any required customer confirmations'] },
  before: { title:'BEFORE FIRST JOB', items:['Eat','Hydrate','Check weather','Check customer addresses','Check route','Check pressure washer','Check hoses/connectors','Check chemicals/materials','Check garden tools','Check fuel/charging','PPE/workwear','Customer contact details'] },
  job: { title:'EACH JOB', items:['Travel','Before photos','Complete work','After photos','Customer sign-off','Collect/record payment','Record expenses','Ask satisfied customers about review/referral where appropriate'] },
  close: { title:'END BUSINESS DAY', items:['Clean equipment','Put equipment away','Record income','Record expenses','Follow up unpaid invoices','Reply to enquiries','Prepare next jobs'] }
};

const weeklyGroups = {
  CALENDAR:["Check next week's appointments",'Check work/night shifts','Check GP/mental-health appointments','Check other commitments'],
  HEALTH:['Schedule STIFF','Schedule meditation','Review sleep','Check treatment/grooming supplies','Check minoxidil/dermaroller schedule'],
  'EDEN GMC':['Review enquiries','Review outstanding quotes','Review booked jobs','Schedule weekend jobs','Check equipment/materials','Review income/expenses'],
  'LIFE ADMIN':['Universal Credit','Bills','Letters','Forms','Emails','Laundry','Room/home tasks']
};

const rules = ['Bella’s walks, food and fresh water are non-negotiable. Move them when work finishes late; never delete or rush them.','Push-ups are not fixed in workday schedules; add them only when appropriate using the Settings switch.','Keep STIFF available in Minimum Day and Weekly Reset, or add it for a selected date using the Settings switch.','Do not schedule Eden GMC growth blocks on workdays.','Gym sessions remain 90 minutes. If an unusually late early shift makes the gym incompatible with essential sleep, move the gym to another suitable day.','Do not catch up on missed optional tasks after a late finish.','Calendar = things happening at a specific time.','This app = what I am doing today.','Capture list = things I remember during the day.','Journal = thoughts and reflection.','Only three priorities per day.','Break vague projects into physical actions.','Use timers to make time visible.','Schedule free time instead of trying to eliminate it.','Do not redesign the system when I have one bad day.','Resume; do not restart.','Done is better than perfect.',"If overwhelmed, use RESET — DON'T THINK.",'If struggling badly, use MINIMUM DAY.'];
const journalPrompts = ['What did I actually accomplish today?','What did I avoid?','What got in the way?','What did I learn?',"What is tomorrow's MUST?","What is tomorrow's first physical action?"];

let state = loadState();
let selectedDate = localDate();
let activeTask = null;
let timerInterval = null;
let timerSeconds = 300;
let timerInitial = 300;
let captureFilter = 'all';
let notificationTimers = [];

function loadState(){
  try { return JSON.parse(localStorage.getItem(APP_KEY)) || defaultState(); } catch { return defaultState(); }
}
function defaultState(){ return { days:{}, captures:[], reusable:{}, weekly:{checks:{},goals:[{},{},{}],monday:{}}, goals:[{},{},{}], settings:{vibration:true} }; }
function saveState(){ localStorage.setItem(APP_KEY, JSON.stringify(state)); }
function localDate(offset=0){ const d=new Date(); d.setDate(d.getDate()+offset); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function dayState(){ return state.days[selectedDate] ||= {mode:null,tasks:{},subtasks:{},priorities:{},journal:{},minoxidil:false}; }
function esc(value=''){ const e=document.createElement('div'); e.textContent=value; return e.innerHTML; }
function taskId(task,i){ return `${task[2]}-${i}`.replace(/[^a-z0-9]+/gi,'-').toLowerCase(); }
function toMinutes(time){ const [h,m]=time.split(':').map(Number); return h*60+m; }
function dateLabel(date){ return new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long'}).format(new Date(`${date}T12:00:00`)); }
function toast(message){ const el=document.querySelector('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),1800); }

function init(){
  document.querySelector('#activeDate').value=selectedDate;
  document.querySelector('#activeDate').addEventListener('change',e=>{selectedDate=e.target.value; renderAll();});
  document.querySelector('#prevDay').addEventListener('click',()=>stepDate(-1));
  document.querySelector('#nextDay').addEventListener('click',()=>stepDate(1));
  document.querySelectorAll('.mode-button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
  document.querySelectorAll('.nav-button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  document.querySelectorAll('[data-open-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.openView)));
  ['Must','Should','Bonus'].forEach(k=>document.querySelector(`#priority${k}`).addEventListener('input',e=>savePriority(k.toLowerCase(),e.target.value)));
  document.querySelector('#firstAction').addEventListener('input',e=>savePriority('first',e.target.value));
  document.querySelector('#jumpNow').addEventListener('click',jumpNow);
  document.querySelector('#openSettings').addEventListener('click',openSettings);
  document.querySelector('#minoxidilToggle').addEventListener('change',e=>{dayState().minoxidil=e.target.checked;saveState();renderToday();});
  document.querySelector('#pushupsToggle').addEventListener('change',e=>{dayState().pushups=e.target.checked;saveState();renderToday();});
  document.querySelector('#stiffToggle').addEventListener('change',e=>{dayState().stiff=e.target.checked;saveState();renderToday();});
  document.querySelector('#actualFinish').addEventListener('change',e=>{dayState().actualFinish=e.target.value;saveState();renderToday();toast('Post-work essentials moved');});
  document.querySelector('#enableAlerts').addEventListener('click',enableAlerts);
  document.querySelector('#exportCalendar').addEventListener('click',exportCalendar);
  document.querySelector('#vibrationToggle').addEventListener('change',e=>{state.settings.vibration=e.target.checked;saveState();});
  document.querySelector('#captureForm').addEventListener('submit',captureThought);
  document.querySelectorAll('.filter-chip').forEach(b=>b.addEventListener('click',()=>{captureFilter=b.dataset.filter;document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x===b));renderCaptures();}));
  document.querySelector('#clearWeekly').addEventListener('click',()=>{if(confirm('Clear the Weekly Reset checks and goal notes?')){state.weekly={checks:{},goals:[{},{},{}],monday:{}};saveState();renderWeekly();}});
  document.querySelector('#clearDate').addEventListener('click',clearSelectedDate);
  document.querySelector('#exportData').addEventListener('click',exportData);
  document.querySelector('#importData').addEventListener('change',importData);
  document.querySelector('#dialogComplete').addEventListener('click',()=>finishDialog('complete'));
  document.querySelector('#dialogSkip').addEventListener('click',()=>finishDialog('skipped'));
  document.querySelector('#timerStart').addEventListener('click',toggleTimer);
  document.querySelector('#timerReset').addEventListener('click',resetTimer);
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  renderAll();
}
function stepDate(n){ const d=new Date(`${selectedDate}T12:00:00`); d.setDate(d.getDate()+n); selectedDate=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; document.querySelector('#activeDate').value=selectedDate; renderAll(); }
function setMode(mode){ const d=dayState(); if(d.mode && d.mode!==mode && Object.values(d.tasks).some(v=>v==='complete') && !confirm('Switch routines for this date? Existing checks will be kept but hidden.')) return; d.mode=mode; d.actualFinish=mode==='normal'?'18:00':mode==='night'?'10:00':null; saveState(); renderToday(); toast(mode==='normal'?'Early Shift + Gym selected':mode==='night'?'Night Shift + Gym selected':'Open day selected'); }
function showView(id){ const extraPages=['edenView','weeklyView','rulesView','goalsView'];document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id)); document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view===id||(extraPages.includes(id)&&b.dataset.view==='extrasView'))); window.scrollTo({top:0,behavior:'smooth'}); }
function renderAll(){ renderToday(); renderTools(); renderBusiness(); renderCaptures(); renderJournal(); renderWeekly(); renderRules(); renderGoals(); }

function shiftTime(time,delta){let value=(toMinutes(time)+delta)%(24*60);if(value<0)value+=24*60;return `${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`;}
function getTasks(d){
  if(d.mode==='open')return [];
  const source=d.mode==='normal'?normalTasks:nightTasks;
  const expected=d.mode==='normal'?'18:00':'10:00';
  const finish=d.actualFinish||expected;
  let delta=toMinutes(finish)-toMinutes(expected);if(d.mode==='night'&&delta<-8*60)delta+=1440;
  const workIndex=source.findIndex(task=>task[2].startsWith('WORK'));
  return source.map((task,i)=>{
    const copy=[task[0],task[1],task[2],[...task[3]],task[4]];
    if(i===workIndex)copy[1]=finish;
    if(i>workIndex){copy[0]=shiftTime(copy[0],delta);copy[1]=shiftTime(copy[1],delta);}
    return copy;
  });
}
function renderSleepWarning(d){
  const warning=document.querySelector('#sleepWarning'),expected=d.mode==='normal'?'18:00':'10:00',finish=d.actualFinish||expected;
  let late=toMinutes(finish)-toMinutes(expected);if(d.mode==='night'&&late<-8*60)late+=1440;
  warning.hidden=false;
  const baseline='Safety check: the complete routine currently leaves about 5 hours 40 minutes between scheduled sleep and wake-up, before any late finish.';
  if(late<=0){warning.textContent=`${baseline} Protecting adequate sleep may require moving a workout or optional task to another day. Schedule STIFF separately through Weekly Reset rather than forcing it into this workday.`;return;}
  warning.textContent=d.mode==='normal'
    ? `${baseline} Work also finished ${late} minutes late. Bella and essential food stay protected; move the gym if it cannot fit without further reducing sleep.`
    : `${baseline} Work also finished ${late} minutes late. Bella, food, hygiene and sleep move later. Do not catch up on optional tasks.`;
}

function renderToday(){
  const d=dayState(); document.querySelector('#todayHeading').textContent=dateLabel(selectedDate);
  document.querySelector('#modeChooser').hidden=!!d.mode; document.querySelector('#dayWorkspace').hidden=!d.mode;
  if(!d.mode) return;
  const tasks=getTasks(d);
  document.querySelector('#modeEyebrow').textContent=d.mode==='normal'?'06:00 EARLY SHIFT · GYM':d.mode==='night'?'22:00–10:00+ NIGHT SHIFT · GYM':'OPEN / REST DAY';
  document.querySelector('#routineHeading').textContent=d.mode==='normal'?'Early Shift + 90-Min Gym':d.mode==='night'?'Night Shift + 90-Min Gym':'No timed routine';
  const p=d.priorities||{}; document.querySelector('#priorityMust').value=p.must||'';document.querySelector('#priorityShould').value=p.should||'';document.querySelector('#priorityBonus').value=p.bonus||'';document.querySelector('#firstAction').value=p.first||'';
  document.querySelector('#priorityCard').hidden=true;
  const finishCard=document.querySelector('#finishCard');finishCard.hidden=d.mode==='open';
  if(d.mode!=='open'){
    const expected=d.mode==='normal'?'18:00':'10:00';
    document.querySelector('#actualFinish').value=d.actualFinish||expected;
    document.querySelector('#finishHelp').textContent=d.mode==='normal'?'Commute, Bella’s evening care, essential food and the after-work plan move from this time.':'Commute, Bella’s morning care, food, hygiene and sleep move from this time.';
    renderSleepWarning(d);
  }
  document.querySelector('#taskList').innerHTML=tasks.length?tasks.map((t,i)=>taskHTML(t,i,d)).join(''):'<div class="task-item"><div></div><div class="task-copy"><button type="button">Open day</button><span>Use free time, appointments or a reset tool without creating an overdue list.</span></div></div>';
  document.querySelectorAll('[data-task-index]').forEach(el=>{el.addEventListener('click',()=>toggleTask(Number(el.dataset.taskIndex)));});
  document.querySelectorAll('[data-task-open]').forEach(el=>{el.addEventListener('click',()=>openTask(Number(el.dataset.taskOpen)));});
  renderOptionalTasks(d);
  updateNow(tasks,d); updateProgress(tasks,d);
  scheduleNotifications(tasks,d);
}
function renderOptionalTasks(d){
  const box=document.querySelector('#optionalTasks'),items=[];
  if(d.pushups)items.push(['optional-pushups','100 PUSH-UPS','Optional today · enabled in Settings']);
  if(d.stiff)items.push(['optional-stiff','STIFF','Optional today · complete the prescribed exercises properly']);
  box.hidden=!items.length;
  box.innerHTML=items.length?`<p class="optional-label">OPTIONAL TODAY</p>${items.map(([id,title,note])=>{const complete=d.tasks[id]==='complete';return `<article class="task-item ${complete?'complete':''}"><button class="task-check" data-optional-task="${id}" aria-label="${complete?'Uncheck':'Complete'} ${title}">${complete?'✓':''}</button><div class="task-copy"><button type="button" data-optional-task="${id}">${title}</button><span>${note}</span></div><span class="task-state">${complete?'DONE':'OPTIONAL'}</span></article>`;}).join('')}`:'';
  box.querySelectorAll('[data-optional-task]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.optionalTask;d.tasks[id]=d.tasks[id]==='complete'?'':'complete';saveState();if(d.tasks[id]==='complete'&&state.settings.vibration&&navigator.vibrate)navigator.vibrate(35);renderOptionalTasks(d);}));
}
function taskHTML(t,i,d){ if(t[2]==='MINOXIDIL'&&!d.minoxidil)return ''; const id=taskId(t,i), status=d.tasks[id]||'', current=isCurrentIndex(i); return `<article class="task-item ${status} ${current?'current':''}" id="task-${i}"><button class="task-check" data-task-index="${i}" aria-label="${status==='complete'?'Uncheck':'Complete'} ${esc(t[2])}">${status==='complete'?'✓':status==='skipped'?'—':''}</button><div class="task-copy"><button type="button" data-task-open="${i}">${esc(t[2])}</button><span>${timeLabel(t,d.mode,i)}${t[3].length?` · ${t[3].length} steps`:''}</span></div><span class="task-state">${status==='complete'?'DONE':status==='skipped'?'LEFT':current?'NOW':''}</span></article>`; }
function timeLabel(t,mode,i){const tasks=getTasks(dayState()),suffix=i>=0&&virtualTime(tasks,i)>=1440?' next day':'';return `${t[0]}–${t[1]}${suffix}`;}
function virtualNow(){const n=new Date(),mins=n.getHours()*60+n.getMinutes();return selectedDate===localDate(-1)?mins+1440:mins;}
function virtualTime(tasks,index){let day=0,last=toMinutes(tasks[0][0]);for(let i=1;i<=index;i++){const current=toMinutes(tasks[i][0]);if(current<last)day+=1440;last=current;}return toMinutes(tasks[index][0])+day;}
function virtualEnd(tasks,index){const start=virtualTime(tasks,index);let end=toMinutes(tasks[index][1])+Math.floor(start/1440)*1440;if(end<=start)end+=1440;return end;}
function isCurrentIndex(i){if(selectedDate!==localDate()&&selectedDate!==localDate(-1))return false;const tasks=getTasks(dayState());return i>=0&&i<tasks.length&&virtualNow()>=virtualTime(tasks,i)&&virtualNow()<virtualEnd(tasks,i);}
function findCurrent(tasks,mode,d){const eligible=t=>t[2]!=='MINOXIDIL'||d.minoxidil;const now=virtualNow();let idx=tasks.findIndex((t,i)=>eligible(t)&&now>=virtualTime(tasks,i)&&now<virtualEnd(tasks,i));if(idx>=0)return idx;idx=tasks.findIndex((t,i)=>eligible(t)&&virtualTime(tasks,i)>now);if(idx>=0)return idx;for(let i=tasks.length-1;i>=0;i--)if(eligible(tasks[i]))return i;return 0;}
function updateNow(tasks,d){ const title=document.querySelector('#nowTitle'),meta=document.querySelector('#nowMeta'),button=document.querySelector('#jumpNow'); if(!tasks.length){title.textContent='Use the day you have';meta.textContent='Open a reset tool only if it helps.';button.hidden=true;return;} button.hidden=false; const i=findCurrent(tasks,d.mode,d),t=tasks[i],current=isCurrentIndex(i); title.textContent=current?t[2]:`Next: ${t[2]}`;meta.textContent=current?`${timeLabel(t,d.mode,i)} · Continue from here.`:`${timeLabel(t,d.mode,i)} · No need to catch up.`;button.dataset.index=i; }
function updateProgress(tasks,d){ const relevant=tasks.filter((t,i)=>d.minoxidil||t[2]!=='MINOXIDIL'); const done=relevant.filter((t,i)=>d.tasks[taskId(t,tasks.indexOf(t))]==='complete').length; const p=relevant.length?Math.round(done/relevant.length*100):0; document.querySelector('#progressText').textContent=`${p}%`;document.querySelector('#progressRing').style.setProperty('--progress',`${p*3.6}deg`); }
function jumpNow(){ const i=Number(document.querySelector('#jumpNow').dataset.index); document.querySelector(`#task-${i}`)?.scrollIntoView({behavior:'smooth',block:'center'}); }
function toggleTask(i){ const d=dayState(),tasks=getTasks(d),t=tasks[i],id=taskId(t,i);d.tasks[id]=d.tasks[id]==='complete'?'': 'complete';saveState(); if(d.tasks[id]==='complete'&&state.settings.vibration&&navigator.vibrate)navigator.vibrate(35);renderToday(); }
function openTask(i){ const d=dayState(),tasks=getTasks(d),t=tasks[i],id=taskId(t,i); activeTask={type:'day',i,id,task:t}; fillDialog(t,t[3],t[4],durationMinutes(t)); document.querySelector('#dialogSkip').textContent='Leave for today';document.querySelector('#dialogComplete').textContent=d.tasks[id]==='complete'?'Mark incomplete':'Mark complete';document.querySelector('#taskDialog').showModal(); }
function durationMinutes(t){ let a=toMinutes(t[0]),b=toMinutes(t[1]);if(b<a)b+=1440;return Math.max(1,b-a); }
function fillDialog(t,items,description,duration){ document.querySelector('#dialogTime').textContent=t[0]?`${t[0]} · ${duration} MINUTES`:`${duration||''}${duration?' MINUTES':''}`;document.querySelector('#dialogTitle').textContent=t[2]||t.title;document.querySelector('#dialogDescription').textContent=description||'';const d=dayState();document.querySelector('#dialogSubtasks').innerHTML=items.map((s,j)=>`<label><input type="checkbox" data-sub="${j}" ${activeTask?.type==='day'&&d.subtasks[`${activeTask.id}-${j}`]?'checked':''}><span>${esc(s)}</span></label>`).join('');document.querySelectorAll('[data-sub]').forEach(c=>c.addEventListener('change',e=>{if(activeTask?.type==='day'){d.subtasks[`${activeTask.id}-${e.target.dataset.sub}`]=e.target.checked;saveState();}}));document.querySelector('#timerBox').hidden=!duration;timerInitial=Math.min(duration||5,60)*60;timerSeconds=timerInitial;document.querySelector('#timerStart').textContent='Start timer';renderTimer(); }
function finishDialog(status){ if(!activeTask)return; if(activeTask.type==='day'){const d=dayState();d.tasks[activeTask.id]=d.tasks[activeTask.id]===status?'':status;}else{state.reusable[activeTask.key] ||= {};state.reusable[activeTask.key].items ||= {}; if(status==='complete') activeTask.routine.items.forEach((_,i)=>state.reusable[activeTask.key].items[i]=true); }saveState();document.querySelector('#taskDialog').close();renderAll();toast(status==='complete'?'Marked complete':'Left without backlog'); }
function savePriority(key,value){dayState().priorities[key]=value;saveState();const s=document.querySelector('#prioritySaveState');s.textContent='Saved';clearTimeout(s._t);s._t=setTimeout(()=>s.textContent='Saved locally',1000);}

function renderTools(){ const box=document.querySelector('#toolCards');box.innerHTML=Object.entries(routines).map(([key,r])=>routineCard(key,r)).join(''); bindRoutineCards(box,routines); }
function renderBusiness(){ const box=document.querySelector('#businessRoutines');box.innerHTML=Object.entries(business).map(([key,r])=>routineCard(`business-${key}`,r)).join(''); bindRoutineCards(box,Object.fromEntries(Object.entries(business).map(([k,v])=>[`business-${k}`,v]))); }
function routineCard(key,r){ const saved=state.reusable[key]?.items||{},done=r.items.filter((_,i)=>saved[i]).length,p=Math.round(done/r.items.length*100);return `<article class="tool-card ${r.featured?'featured':''}"><p class="eyebrow">${r.duration?`${r.duration} MINUTES`:'REUSABLE CHECKLIST'}</p><h2>${esc(r.title)}</h2><p>${esc(r.note||'Tick each step as you complete it.')}</p><div class="tool-progress"><span style="width:${p}%"></span></div><p>${done} of ${r.items.length} complete</p><div class="tool-card-actions"><button class="primary-button" data-open-routine="${key}" type="button">Open checklist</button>${done?`<button class="secondary-button" data-reset-routine="${key}" type="button">Reset</button>`:''}</div></article>`; }
function bindRoutineCards(box,map){ box.querySelectorAll('[data-open-routine]').forEach(b=>b.addEventListener('click',()=>openRoutine(b.dataset.openRoutine,map[b.dataset.openRoutine])));box.querySelectorAll('[data-reset-routine]').forEach(b=>b.addEventListener('click',()=>{state.reusable[b.dataset.resetRoutine]={items:{}};saveState();renderTools();renderBusiness();})); }
function openRoutine(key,r){ activeTask={type:'routine',key,routine:r};const saved=state.reusable[key]?.items||{};const t=['','',''];t.title=r.title;fillDialog(t,r.items,r.note,r.duration||0);document.querySelector('#dialogSubtasks').innerHTML=r.items.map((s,i)=>`<label><input type="checkbox" data-routine-sub="${i}" ${saved[i]?'checked':''}><span>${esc(s)}</span></label>`).join('');document.querySelectorAll('[data-routine-sub]').forEach(c=>c.addEventListener('change',e=>{state.reusable[key] ||= {items:{}};state.reusable[key].items[e.target.dataset.routineSub]=e.target.checked;saveState();renderTools();renderBusiness();}));document.querySelector('#dialogSkip').textContent='Close for now';document.querySelector('#dialogComplete').textContent='Complete all';document.querySelector('#taskDialog').showModal(); }

function captureThought(e){e.preventDefault();const input=document.querySelector('#captureInput'),text=input.value.trim();if(!text)return;state.captures.unshift({id:crypto.randomUUID?.()||Date.now().toString(),text,type:guessType(text),created:new Date().toISOString(),done:false});input.value='';saveState();renderCaptures();toast('Captured — return to your task');}
function guessType(text){const s=text.toLowerCase();if(/buy|purchase|order|£/.test(s))return'purchase';if(/research|look up|find out|youtube|video/.test(s))return'research';if(/idea|maybe|could/.test(s))return'idea';return'task';}
function renderCaptures(){const list=document.querySelector('#captureList'),items=state.captures.filter(x=>captureFilter==='all'||x.type===captureFilter);list.innerHTML=items.length?items.map(x=>`<article class="capture-item ${x.done?'done':''}"><div><p>${esc(x.text)}</p><div class="capture-meta">${x.type.toUpperCase()} · ${new Date(x.created).toLocaleDateString('en-GB')}</div></div><div class="capture-actions"><button type="button" data-capture-done="${x.id}">${x.done?'Undo':'Done'}</button><button type="button" data-capture-delete="${x.id}" aria-label="Delete">×</button></div></article>`).join(''):'<div class="tool-card"><h2>Nothing waiting</h2><p>Capture thoughts without leaving the task you are doing.</p></div>';list.querySelectorAll('[data-capture-done]').forEach(b=>b.addEventListener('click',()=>{const x=state.captures.find(x=>x.id===b.dataset.captureDone);x.done=!x.done;saveState();renderCaptures();}));list.querySelectorAll('[data-capture-delete]').forEach(b=>b.addEventListener('click',()=>{state.captures=state.captures.filter(x=>x.id!==b.dataset.captureDelete);saveState();renderCaptures();}));}

function renderJournal(){const d=dayState(),box=document.querySelector('#journalFields');box.innerHTML=journalPrompts.map((p,i)=>`<label>${esc(p)}<textarea data-journal="${i}" placeholder="A few honest words…">${esc(d.journal[i]||'')}</textarea></label>`).join('');box.querySelectorAll('[data-journal]').forEach(t=>t.addEventListener('input',e=>{dayState().journal[e.target.dataset.journal]=e.target.value;saveState();}));}
function renderWeekly(){const box=document.querySelector('#weeklyReset');box.innerHTML=`<div class="weekly-grid">${Object.entries(weeklyGroups).map(([name,items])=>`<section class="weekly-group"><h3>${name}</h3><div class="inline-checklist">${items.map((x,i)=>weeklyCheck(`${name}-${i}`,x)).join('')}</div></section>`).join('')}<section class="weekly-group weekly-goals"><h3>GOALS — CHOOSE ONLY THREE</h3><p>For each: outcome, this week’s result and first physical action.</p>${[0,1,2].map(i=>`<div class="weekly-goal"><input data-week-goal="${i}:outcome" placeholder="Outcome" value="${esc(state.weekly.goals[i]?.outcome||'')}"><input data-week-goal="${i}:result" placeholder="This week’s result" value="${esc(state.weekly.goals[i]?.result||'')}"><input data-week-goal="${i}:first" placeholder="First physical action" value="${esc(state.weekly.goals[i]?.first||'')}"></div>`).join('')}<h3 style="margin-top:1rem">MONDAY</h3><div class="weekly-goal">${['must','should','bonus'].map(x=>`<input data-monday="${x}" placeholder="${x.toUpperCase()}" value="${esc(state.weekly.monday[x]||'')}">`).join('')}</div></section></div>`;box.querySelectorAll('[data-week-check]').forEach(c=>c.addEventListener('change',e=>{state.weekly.checks[e.target.dataset.weekCheck]=e.target.checked;saveState();}));box.querySelectorAll('[data-week-goal]').forEach(i=>i.addEventListener('input',e=>{const [n,k]=e.target.dataset.weekGoal.split(':');state.weekly.goals[n] ||= {};state.weekly.goals[n][k]=e.target.value;saveState();}));box.querySelectorAll('[data-monday]').forEach(i=>i.addEventListener('input',e=>{state.weekly.monday[e.target.dataset.monday]=e.target.value;saveState();}));}
function weeklyCheck(id,label){return `<label class="inline-check"><input type="checkbox" data-week-check="${esc(id)}" ${state.weekly.checks[id]?'checked':''}><span>${esc(label)}</span></label>`;}
function renderRules(){document.querySelector('#rulesList').innerHTML=rules.map(x=>`<li>${esc(x)}</li>`).join('');}
function renderGoals(){const box=document.querySelector('#goalEditor');box.innerHTML=`<div class="goal-slots">${[0,1,2].map(i=>{const g=state.goals[i]||{};return `<section class="goal-slot"><h3>GOAL ${i+1}</h3><div class="goal-grid">${goalField(i,'goal','Goal',g.goal)}${goalField(i,'why','Why does this matter to me?',g.why,true)}${goalField(i,'outcome','12-week outcome',g.outcome,true)}${goalField(i,'week',"This week's measurable result",g.week)}${goalField(i,'today','What can I do today?',g.today)}${goalField(i,'first','First physical action',g.first,true)}</div><div class="goal-levels"><div class="goal-level"><strong>5 min</strong><span>Minimum</span></div><div class="goal-level"><strong>30 min</strong><span>Target</span></div><div class="goal-level"><strong>60 min</strong><span>Excellent</span></div></div></section>`}).join('')}</div>`;box.querySelectorAll('[data-goal]').forEach(el=>el.addEventListener('input',e=>{const [i,k]=e.target.dataset.goal.split(':');state.goals[i] ||= {};state.goals[i][k]=e.target.value;saveState();}));}
function goalField(i,key,label,value='',full=false){return `<label class="goal-field ${full?'full':''}">${esc(label)}<${full?'textarea':'input'} data-goal="${i}:${key}" ${full?'':'type="text"'}>${full?esc(value):''}${full?'</textarea>':`</input>`}</label>`.replace('<input data-goal',`<input value="${esc(value)}" data-goal`);}

async function enableAlerts(){
  if(!('Notification' in window)){toast('This browser does not support app alerts');return;}
  const permission=await Notification.requestPermission();
  state.settings.notifications=permission==='granted';saveState();
  if(permission==='granted'){scheduleNotifications(getTasks(dayState()),dayState());toast('Task alerts enabled while the app is active');}
  else toast('Notification permission was not enabled');
}
function scheduleNotifications(tasks,d){
  notificationTimers.forEach(clearTimeout);notificationTimers=[];
  const button=document.querySelector('#enableAlerts');
  if('Notification' in window&&Notification.permission==='granted')button.textContent='Task alerts enabled';else button.textContent='Enable task alerts';
  if(!state.settings.notifications||!('Notification' in window)||Notification.permission!=='granted'||!tasks.length)return;
  const [year,month,day]=selectedDate.split('-').map(Number),base=new Date(year,month-1,day,0,0,0,0),now=Date.now();
  tasks.forEach((task,i)=>{
    if(task[2]==='MINOXIDIL'&&!d.minoxidil)return;
    const when=base.getTime()+virtualTime(tasks,i)*60000,delay=when-now;
    if(delay<=0||delay>2147483647)return;
    notificationTimers.push(setTimeout(async()=>{
      const options={body:`${task[0]} · ${task[4]||'Start from the first physical action.'}`,icon:'./icon.svg',tag:`kb-${selectedDate}-${i}`};
      try{const registration=await navigator.serviceWorker?.ready;if(registration)registration.showNotification(task[2],options);else new Notification(task[2],options);}catch{new Notification(task[2],options);}
    },delay));
  });
}
function icsDate(date){return `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}T${String(date.getHours()).padStart(2,'0')}${String(date.getMinutes()).padStart(2,'0')}00`;}
function icsText(value=''){return String(value).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function exportCalendar(){
  const d=dayState(),tasks=getTasks(d);if(!tasks.length){toast('Choose a work routine first');return;}
  const [year,month,day]=selectedDate.split('-').map(Number),base=new Date(year,month-1,day,0,0,0,0);
  const events=tasks.filter(t=>d.minoxidil||t[2]!=='MINOXIDIL').map(task=>{const i=tasks.indexOf(task),start=new Date(base.getTime()+virtualTime(tasks,i)*60000),end=new Date(base.getTime()+virtualEnd(tasks,i)*60000);return ['BEGIN:VEVENT',`UID:kb-${selectedDate}-${i}@life-manager`,`DTSTAMP:${icsDate(new Date())}`,`DTSTART:${icsDate(start)}`,`DTEND:${icsDate(end)}`,`SUMMARY:${icsText(task[2])}`,`DESCRIPTION:${icsText(task[4]||task[3].join(' · '))}`,'BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY',`DESCRIPTION:${icsText(task[2])}`,'END:VALARM','END:VEVENT'].join('\r\n');}).join('\r\n');
  const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//KB Life Manager//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',events,'END:VCALENDAR'].join('\r\n');
  const blob=new Blob([content],{type:'text/calendar;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`kb-${d.mode}-routine-${selectedDate}.ics`;a.click();URL.revokeObjectURL(a.href);toast('Calendar routine downloaded');
}

function openSettings(){const d=dayState();document.querySelector('#minoxidilToggle').checked=!!d.minoxidil;document.querySelector('#pushupsToggle').checked=!!d.pushups;document.querySelector('#stiffToggle').checked=!!d.stiff;document.querySelector('#vibrationToggle').checked=state.settings.vibration!==false;document.querySelector('#settingsDialog').showModal();}
function clearSelectedDate(){if(!confirm(`Clear checks, priorities and journal for ${dateLabel(selectedDate)}?`))return;delete state.days[selectedDate];saveState();document.querySelector('#settingsDialog').close();renderAll();toast('Selected date cleared');}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`kb-life-manager-backup-${localDate()}.json`;a.click();URL.revokeObjectURL(a.href);toast('Backup downloaded');}
function importData(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const next=JSON.parse(reader.result);if(!next.days||!next.settings)throw new Error();if(confirm('Replace this device’s app data with the backup?')){state=next;saveState();renderAll();document.querySelector('#settingsDialog').close();toast('Backup restored');}}catch{alert('That file is not a valid KB Life Manager backup.');}};reader.readAsText(file);e.target.value='';}
function toggleTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null;document.querySelector('#timerStart').textContent='Continue';return;}document.querySelector('#timerStart').textContent='Pause';timerInterval=setInterval(()=>{timerSeconds--;renderTimer();if(timerSeconds<=0){clearInterval(timerInterval);timerInterval=null;document.querySelector('#timerStart').textContent='Start again';if(navigator.vibrate)navigator.vibrate([100,80,100]);toast('Timer finished');}},1000);}
function resetTimer(){clearInterval(timerInterval);timerInterval=null;timerSeconds=timerInitial;document.querySelector('#timerStart').textContent='Start timer';renderTimer();}
function renderTimer(){const m=Math.floor(timerSeconds/60),s=timerSeconds%60;document.querySelector('#timerDisplay').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}

init();
