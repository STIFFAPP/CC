const PLANS=window.WORKOUT_PLANS||{v1:{label:"Beginner",data:window.WORKOUT_DATA_V1,accessories:window.WORKOUT_ACCESSORIES||{}},v2:{label:"Intermediate",data:window.WORKOUT_DATA_V2,accessories:window.WORKOUT_ACCESSORIES||{}},v3:{label:"Advanced",data:window.WORKOUT_DATA,accessories:window.WORKOUT_ACCESSORIES||{}}};
const LEGACY_STORAGE_KEY="kb-workout-v1";
const LEGACY_PREFS_KEY="kb-workout-prefs-v1";
const DEFAULT_PREFS={plan:"v1",week:1,day:0,step:2.5,unit:"kg"};
let workoutStarted=true;
let state={};
let prefs={...DEFAULT_PREFS};
let DATA=PLANS[prefs.plan].data;
let ACCESSORIES=PLANS[prefs.plan].accessories||{};

const $=s=>document.querySelector(s);
const planSelect=$("#planSelect"),weekSelect=$("#weekSelect"),dayTabs=$("#dayTabs"),exerciseList=$("#exerciseList");
const phaseLabel=$("#phaseLabel"),sessionTitle=$("#sessionTitle"),extraWork=$("#extraWork");
const progressRing=$("#progressRing"),progressPercent=$("#progressPercent"),toast=$("#toast");
const stepSelect=$("#stepSelect"),unitSelect=$("#unitSelect");
const beforeSection=$("#beforeSection"),afterSection=$("#afterSection");
const settingsBtn=$("#settingsBtn"),sessionFooter=document.querySelector(".session-footer");
const EXERCISE_DB_URL="https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const EXERCISE_IMAGE_ROOT="https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const GUIDE_OVERRIDES=window.WORKOUT_GUIDE_OVERRIDES||{};
let exerciseDatabase=null,currentGuideExercise=null;

Object.entries(PLANS).forEach(([value,plan])=>{const option=document.createElement("option");option.value=value;option.textContent=plan.label;planSelect.append(option)});
planSelect.value=prefs.plan;
for(let w=1;w<=12;w++){const o=document.createElement("option");o.value=w;o.textContent=String(w);weekSelect.append(o)}
weekSelect.value=prefs.week;
stepSelect.value=String(prefs.step);unitSelect.value=prefs.unit;

localStorage.removeItem("kb-workout-state-guest");localStorage.removeItem("kb-workout-prefs-guest");
function storageKey(kind){return `kb-workout-${kind}-kb`}
function loadStoredJson(key,fallback={}){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch(error){return fallback}}
function savePrefs(){if(workoutStarted)localStorage.setItem(storageKey("prefs"),JSON.stringify(prefs))}
function saveState(){if(workoutStarted)localStorage.setItem(storageKey("state"),JSON.stringify(state));updateProgress()}
function startWorkout(){
  workoutStarted=true;
  const stateKey=storageKey("state"),prefsKey=storageKey("prefs");
  if(localStorage.getItem(stateKey)===null){const legacy=localStorage.getItem(LEGACY_STORAGE_KEY);if(legacy!==null)localStorage.setItem(stateKey,legacy)}
  if(localStorage.getItem(prefsKey)===null){const legacy=localStorage.getItem(LEGACY_PREFS_KEY);if(legacy!==null)localStorage.setItem(prefsKey,legacy)}
  state=loadStoredJson(stateKey,{});prefs={...DEFAULT_PREFS,...loadStoredJson(prefsKey,{})};
  if(!PLANS[prefs.plan])prefs.plan="v1";
  DATA=PLANS[prefs.plan].data;ACCESSORIES=PLANS[prefs.plan].accessories||{};
  planSelect.value=prefs.plan;weekSelect.value=String(prefs.week);stepSelect.value=String(prefs.step);unitSelect.value=prefs.unit;
  $("#workoutPage").hidden=false;sessionFooter.hidden=false;settingsBtn.hidden=false;
  savePrefs();render();window.scrollTo({top:0,behavior:"auto"});
}
function phaseForWeek(w){return DATA.phases.find(p=>w>=p.startWeek&&w<=p.endWeek)}
function planStatePrefix(){return prefs.plan==="v3"?"":`${prefs.plan}|`}
function setKey(exerciseId,setIndex){return `${planStatePrefix()}${prefs.week}|${prefs.day}|${exerciseId}|${setIndex}`}
function getSet(exerciseId,setIndex){return state[setKey(exerciseId,setIndex)]||{weight:"",done:false}}
function historicalSetKey(week,day,exerciseId,setIndex){return `${planStatePrefix()}${week}|${day}|${exerciseId}|${setIndex}`}
function normalizedExerciseName(name){return name.toLowerCase().replace(/[^a-z0-9]+/g," ").replace(/\bweighted\b/g,"").trim()}
function matchingName(name){
  const aliases={
    "lat pull in":"wide grip lat pulldown","under hand pull downs":"underhand cable pulldowns","straight arm pull downs":"straight arm pulldown",
    "smith single arm sideways over head press":"one arm dumbbell shoulder press","crusafix diagnal sit up":"cross body crunch","twisting bleets":"oblique crunches",
    "forearm plate pronated through slits":"palms down wrist curl over a bench","forearm plate supinated through slits":"palms up wrist curl over a bench",
    "forearm plate pronated wide grip":"standing palms up barbell behind the back wrist curl","manual hamstring curls":"natural glute ham raise",
    "single leg hip lifts":"single leg glute bridge","machine hamstring curls":"lying leg curls","standing leg curls":"standing leg curl",
    "cable reverse fly":"reverse flyes","bent over lateral raise":"bent over dumbbell rear delt raise","bent over reverse dumbbell fly":"reverse flyes",
    "flat bench dumbbell press":"dumbbell bench press","flat dumbbell press 25":"dumbbell bench press","barbell press":"barbell bench press medium grip",
    "flat barbell press":"barbell bench press medium grip","box squats":"box squat","boxed squats":"box squat","abs wheel":"ab roller",
    "cable hammers curls":"rope hammer curl","cable rope extensions":"triceps pushdown rope attachment","rope extensions":"triceps pushdown rope attachment",
    "leg raise":"hanging leg raise","bicycle crunches":"air bike","scissors":"scissor kick","elevated knee in twist":"cross body crunch","side plank":"push up to side plank"
  };
  const normalized=normalizedExerciseName(name);return aliases[normalized]||normalized;
}
function previousWeight(exerciseName,setIndex){
  const target=normalizedExerciseName(exerciseName);
  for(let week=Number(prefs.week)-1;week>=1;week--){
    const phase=phaseForWeek(week);
    for(let day=phase.days.length-1;day>=0;day--){
      const match=phase.days[day].exercises.find(e=>normalizedExerciseName(e.name)===target);
      if(!match)continue;
      const saved=state[historicalSetKey(week,day,match.id,setIndex)];
      if(saved?.weight!==""&&saved?.weight!=null)return{weight:saved.weight,week,day:phase.days[day].day};
    }
  }
  return null;
}
function flash(message){toast.textContent=message;toast.classList.add("show");clearTimeout(flash.t);flash.t=setTimeout(()=>toast.classList.remove("show"),1600)}
function formatWeight(v){if(v===""||v==null)return "";return Number(v).toFixed(2).replace(/\.00$/,"").replace(/(\.\d)0$/,"$1")}

function renderDayTabs(phase){
  dayTabs.replaceChildren();
  phase.days.forEach((d,i)=>{const b=document.createElement("button");b.className="day-tab";b.role="tab";b.dataset.day=i;b.textContent=d.day.slice(0,3);b.addEventListener("click",()=>{prefs.day=i;savePrefs();render()});dayTabs.append(b)});
}

function render(){
  const phase=phaseForWeek(Number(prefs.week));
  if(prefs.day>=phase.days.length)prefs.day=phase.days.length-1;
  renderDayTabs(phase);const day=phase.days[prefs.day];
  [...dayTabs.children].forEach((b,i)=>b.setAttribute("aria-selected",String(i===prefs.day)));
  phaseLabel.textContent=phase.label;sessionTitle.textContent=`${day.day} · ${day.focus||"Workout"}`;extraWork.textContent="";extraWork.hidden=true;
  exerciseList.replaceChildren();$("#emptyState").hidden=day.exercises.length>0;
  renderExerciseGroups(day.exercises);
  renderAccessorySections(day);
  updateProgress();
}

function renderExerciseGroups(exercises){
  let index=0;
  while(index<exercises.length){
    const exercise=exercises[index];
    if(!exercise.groupId){exerciseList.append(buildExercise(exercise,index));index+=1;continue}
    const group=[];const groupId=exercise.groupId;
    while(index<exercises.length&&exercises[index].groupId===groupId){group.push({exercise:exercises[index],index});index+=1}
    const wrapper=document.createElement("section");wrapper.className=`exercise-batch batch-${group[0].exercise.groupColor}`;
    const title=group[0].exercise.groupColor==="green-red"||group.length===2?"SUPERSET":"GROUPED SET";
    wrapper.innerHTML=`<div class="batch-head"><div><span>${title}</span><strong>${group.length} exercises</strong></div><small>Complete them back-to-back, then rest.</small></div><div class="batch-exercises"></div>`;
    const list=wrapper.querySelector(".batch-exercises");group.forEach(item=>list.append(buildExercise(item.exercise,item.index)));
    exerciseList.append(wrapper);
  }
}

function renderAccessorySections(day){
  beforeSection.replaceChildren();afterSection.replaceChildren();beforeSection.hidden=true;afterSection.hidden=true;
  const accessory=ACCESSORIES[day.day];if(!accessory)return;
  const target=accessory.position==="before"?beforeSection:afterSection;target.hidden=false;
  const head=document.createElement("div");head.className="accessory-head";head.innerHTML=`<span class="accessory-position">${accessory.position.toUpperCase()}</span><h3>${accessory.title}</h3><p>${accessory.description}</p>`;target.append(head);
  if(accessory.type==="hiit"){
    const card=document.createElement("article");card.className="hiit-card";card.innerHTML=`<div><strong>10 rounds</strong><span>JOG 1:00 · RUN 1:00</span></div><button class="primary" type="button">Start HIIT</button>`;card.querySelector("button").addEventListener("click",openTimer);target.append(card);return;
  }
  const list=document.createElement("div");list.className="exercise-list accessory-list";accessory.exercises.forEach((exercise,index)=>list.append(buildExercise(exercise,index,"AFTER")));target.append(list);
}

function buildExercise(exercise,index,label="EXERCISE"){
  const card=document.createElement("article");card.className="exercise";card.dataset.exercise=exercise.id;
  const completed=Array.from({length:exercise.sets},(_,i)=>getSet(exercise.id,i).done).filter(Boolean).length;
  card.innerHTML=`<div class="exercise-head"><div><div class="exercise-number">${label} ${String(index+1).padStart(2,"0")}</div><h3></h3><div class="target"></div></div><span class="completion">${completed}/${exercise.sets} sets</span></div><div class="sets"></div>`;
  const nameHeading=card.querySelector("h3");const nameButton=document.createElement("button");nameButton.className="exercise-link";nameButton.textContent=exercise.name;nameButton.setAttribute("aria-label",`Open guide for ${exercise.name}`);nameButton.addEventListener("click",()=>openExerciseGuide(exercise));nameHeading.append(nameButton);card.querySelector(".target").textContent=exercise.targetLabel||`${exercise.sets} sets · ${exercise.reps}${exercise.repUnit===""?"":" reps"}`;
  const sets=card.querySelector(".sets");
  for(let i=0;i<exercise.sets;i++){
    const saved=getSet(exercise.id,i),previous=exercise.trackWeight===false?null:previousWeight(exercise.name,i);const row=document.createElement("div");row.className=`set-row${exercise.trackWeight===false?" bodyweight-row":""}`;row.dataset.key=setKey(exercise.id,i);
    const previousText=previous?`<small class="previous-weight">[${formatWeight(previous.weight)} ${prefs.unit}]</small>`:"";
    const repUnit=exercise.repUnit===""?"":" reps";const tracking=exercise.trackWeight===false?`<span class="bodyweight-tag">${exercise.repUnit===""?"Timed":"Bodyweight"}</span>`:`<div class="weight-input"><input type="number" inputmode="decimal" min="0" step="0.25" aria-label="${exercise.name}, set ${i+1}, one-side weight"><span>${prefs.unit}</span></div><div class="adjust"><button type="button" data-delta="-1" aria-label="Decrease weight">−</button><button type="button" data-delta="1" aria-label="Increase weight">+</button></div>`;
    row.innerHTML=`<span class="set-label">Set ${i+1}<small>${exercise.repTargets[i]||exercise.reps}${repUnit}</small>${previousText}</span>${tracking}<button type="button" class="check ${saved.done?"done":""}" aria-label="Mark set ${i+1} ${saved.done?"unfinished":"complete"}"></button>`;
    const input=row.querySelector("input");if(input){input.value=formatWeight(saved.weight);input.addEventListener("input",()=>updateSet(exercise.id,i,{weight:input.value}));row.querySelectorAll("[data-delta]").forEach(b=>b.addEventListener("click",()=>{const current=Number(input.value)||0;const value=Math.max(0,current+Number(b.dataset.delta)*Number(prefs.step));input.value=formatWeight(value);updateSet(exercise.id,i,{weight:input.value});input.focus()}))}
    row.querySelector(".check").addEventListener("click",()=>{const current=getSet(exercise.id,i);updateSet(exercise.id,i,{done:!current.done});render()});sets.append(row);
  }
  return card;
}

function tokenSet(name){
  const ignored=new Set(["the","a","and","with","single","one","arm","alternating","alternate","standing","seated","lying","smith","machine","cable","barbell","dumbbell","weighted","wide","close","grip","flat","incline","reverse","over","under","hand","bilateral","each","pre","exhaust"]);
  return new Set(matchingName(name).split(" ").filter(t=>t.length>1&&!ignored.has(t)));
}
function exerciseScore(requested,candidate){
  const a=matchingName(requested),b=normalizedExerciseName(candidate.name);if(a===b)return 100;
  if(b.includes(a)||a.includes(b))return 80+Math.min(a.length,b.length)/Math.max(a.length,b.length)*10;
  const aa=tokenSet(a),bb=tokenSet(b);let overlap=0;aa.forEach(t=>{if(bb.has(t))overlap++});const union=new Set([...aa,...bb]).size||1;return overlap/union*70+(overlap&&candidate.category==="strength"?3:0);
}
async function loadExerciseDatabase(){if(exerciseDatabase)return exerciseDatabase;const response=await fetch(EXERCISE_DB_URL);if(!response.ok)throw new Error("Exercise guide download failed");exerciseDatabase=await response.json();return exerciseDatabase}
async function openExerciseGuide(exercise){
  currentGuideExercise=exercise;$("#workoutPage").hidden=true;$("#exercisePage").hidden=false;document.querySelector(".session-footer").hidden=true;$("#settingsBtn").hidden=true;$("#detailTitle").textContent=exercise.name;$("#detailMatch").textContent="";$("#detailLoading").hidden=false;$("#detailContent").hidden=true;$("#detailError").hidden=true;window.scrollTo({top:0,behavior:"auto"});if(!location.hash.startsWith("#exercise="))history.pushState({exercise:exercise.id},"",`#exercise=${encodeURIComponent(exercise.id)}`);
  const override=GUIDE_OVERRIDES[normalizedExerciseName(exercise.name)];if(override){renderExerciseGuide(exercise,{name:exercise.name,...override},100);return}
  try{const database=await loadExerciseDatabase();const best=database.map(item=>({item,score:exerciseScore(exercise.name,item)})).sort((x,y)=>y.score-x.score)[0];if(!best||best.score<18)throw new Error("No suitable guide found");renderExerciseGuide(exercise,best.item,best.score)}catch(error){$("#detailLoading").hidden=true;$("#detailError").hidden=false}
}
function renderExerciseGuide(requested,guide,score){
  $("#detailLoading").hidden=true;$("#detailContent").hidden=false;$("#detailMatch").textContent=guide.subtitle||(score<75&&normalizedExerciseName(requested.name)!==normalizedExerciseName(guide.name)?`Closest demonstration: ${guide.name}`:"");
  const images=$("#demoImages");images.replaceChildren();(guide.images||[]).slice(0,3).forEach((entry,index)=>{const path=typeof entry==="string"?entry:entry.src;const figure=document.createElement("figure");const img=document.createElement("img");img.src=/^https?:\/\//.test(path)?path:EXERCISE_IMAGE_ROOT+path;img.alt=typeof entry==="string"?`${guide.name} ${index===0?"starting":"finishing"} position`:(entry.alt||`${guide.name}: ${entry.caption||`step ${index+1}`}`);img.loading=index?"lazy":"eager";figure.append(img);const caption=document.createElement("figcaption");caption.textContent=typeof entry==="string"?(index===0?"Start position":"Finish position"):(entry.caption||`Step ${index+1}`);figure.append(caption);images.append(figure)});
  const list=$("#detailInstructions");list.replaceChildren();(guide.instructions||[]).forEach(text=>{const li=document.createElement("li");li.textContent=text;list.append(li)});
  const facts=$("#exerciseFacts");facts.replaceChildren();[["Equipment",guide.equipment],["Format",guide.format],["Level",guide.level],["Main muscles",(guide.primaryMuscles||[]).join(", ")],["Also works",(guide.secondaryMuscles||[]).join(", ")]].filter(([,v])=>v).forEach(([term,value])=>{const dt=document.createElement("dt");dt.textContent=term;const dd=document.createElement("dd");dd.textContent=value;facts.append(dt,dd)});
  const source=$("#guideSource");if(guide.sourceUrl){source.href=guide.sourceUrl;source.hidden=false}else{source.hidden=true;source.removeAttribute("href")}
  $("#exerciseCredit").textContent=guide.credit||(guide.sourceUrl?"Demonstration selected from the linked exercise source.":"Demonstration data and images: Free Exercise DB, public domain.");
}
function closeExerciseGuide(){if($("#exercisePage").hidden)return;$("#exercisePage").hidden=true;$("#workoutPage").hidden=false;document.querySelector(".session-footer").hidden=false;$("#settingsBtn").hidden=false;currentGuideExercise=null;history.replaceState(null,"",location.pathname+location.search);window.scrollTo({top:0,behavior:"auto"})}

const HIIT_INTERVALS=Array.from({length:20},(_,index)=>index%2?"RUN":"JOG");
const timerState={index:0,remainingMs:60000,running:false,endAt:0,tickId:null,finished:false};
function timerTime(ms){const seconds=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`}
function updateTimerView(){
  const action=timerState.finished?"FINISHED":HIIT_INTERVALS[timerState.index];$("#timerAction").textContent=action;$("#timerAction").dataset.action=action;
  $("#timerCountdown").textContent=timerState.finished?"20:00":timerTime(timerState.remainingMs);$("#timerRound").textContent=timerState.finished?"Workout complete":`Interval ${timerState.index+1} of ${HIIT_INTERVALS.length}`;
  $("#timerNext").textContent=timerState.finished?"HIIT complete — cool down and recover.":timerState.index<HIIT_INTERVALS.length-1?`Next: ${HIIT_INTERVALS[timerState.index+1]}`:"Final interval";
  const elapsed=timerState.finished?1200000:timerState.index*60000+(60000-timerState.remainingMs);$("#timerProgressBar").style.width=`${Math.min(100,elapsed/1200000*100)}%`;
  $("#pauseTimer").textContent=timerState.running?"Pause":timerState.finished?"Finished":"Resume";$("#pauseTimer").disabled=timerState.finished;
}
function timerBeep(){try{const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;const context=new AudioContext(),oscillator=context.createOscillator(),gain=context.createGain();oscillator.connect(gain);gain.connect(context.destination);oscillator.frequency.value=timerState.finished?880:660;gain.gain.setValueAtTime(.08,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.18);oscillator.start();oscillator.stop(context.currentTime+.18)}catch(error){}}
function stopTimerTick(){if(timerState.tickId)clearInterval(timerState.tickId);timerState.tickId=null}
function pauseTimer(){if(!timerState.running)return;timerState.remainingMs=Math.max(0,timerState.endAt-Date.now());timerState.running=false;stopTimerTick();updateTimerView()}
function advanceTimer(){stopTimerTick();timerState.index+=1;timerBeep();if(timerState.index>=HIIT_INTERVALS.length){timerState.index=HIIT_INTERVALS.length-1;timerState.remainingMs=0;timerState.running=false;timerState.finished=true;updateTimerView();return}timerState.remainingMs=60000;startTimer()}
function timerTick(){timerState.remainingMs=Math.max(0,timerState.endAt-Date.now());if(timerState.remainingMs<=0){advanceTimer();return}updateTimerView()}
function startTimer(){if(timerState.finished)return;stopTimerTick();timerState.running=true;timerState.endAt=Date.now()+timerState.remainingMs;timerState.tickId=setInterval(timerTick,250);updateTimerView()}
function resetTimer(autoStart=false){stopTimerTick();Object.assign(timerState,{index:0,remainingMs:60000,running:false,endAt:0,finished:false,tickId:null});updateTimerView();if(autoStart)startTimer()}
function openTimer(){$("#workoutPage").hidden=true;$("#exercisePage").hidden=true;$("#timerPage").hidden=false;document.querySelector(".session-footer").hidden=true;$("#settingsBtn").hidden=true;history.pushState({timer:true},"","#hiit");window.scrollTo({top:0,behavior:"auto"});resetTimer(true)}
function closeTimer(replaceHistory=true){if($("#timerPage").hidden)return;pauseTimer();$("#timerPage").hidden=true;$("#workoutPage").hidden=false;document.querySelector(".session-footer").hidden=false;$("#settingsBtn").hidden=false;if(replaceHistory)history.replaceState(null,"",location.pathname+location.search);window.scrollTo({top:0,behavior:"auto"})}

function updateSet(exerciseId,setIndex,patch){const key=setKey(exerciseId,setIndex);state[key]={...getSet(exerciseId,setIndex),...patch};saveState()}
function updateProgress(){const phase=phaseForWeek(Number(prefs.week)),day=phase.days[prefs.day],accessory=ACCESSORIES[day.day];const exercises=[...day.exercises,...(accessory?.type==="exercises"?accessory.exercises:[])];let total=0,done=0;exercises.forEach(e=>{total+=e.sets;for(let i=0;i<e.sets;i++)if(getSet(e.id,i).done)done++});const pct=total?Math.round(done/total*100):0;progressPercent.textContent=`${pct}%`;progressRing.style.setProperty("--progress",`${pct}%`)}

planSelect.addEventListener("change",()=>{prefs.plan=planSelect.value;DATA=PLANS[prefs.plan].data;ACCESSORIES=PLANS[prefs.plan].accessories||{};prefs.day=0;savePrefs();render();window.scrollTo({top:0,behavior:"smooth"})});
weekSelect.addEventListener("change",()=>{prefs.week=Number(weekSelect.value);savePrefs();render();window.scrollTo({top:0,behavior:"smooth"})});
settingsBtn.addEventListener("click",()=>$("#settingsDialog").showModal());
stepSelect.addEventListener("change",()=>{prefs.step=Number(stepSelect.value);savePrefs()});
unitSelect.addEventListener("change",()=>{prefs.unit=unitSelect.value;savePrefs();render()});
$("#resetDayBtn").addEventListener("click",()=>{if(!confirm("Clear every weight and completed set for this day?"))return;const prefix=`${planStatePrefix()}${prefs.week}|${prefs.day}|`;Object.keys(state).filter(k=>k.startsWith(prefix)).forEach(k=>delete state[k]);saveState();render();flash("Day reset")});
$("#nextSetBtn").addEventListener("click",()=>{const phase=phaseForWeek(Number(prefs.week)),day=phase.days[prefs.day],accessory=ACCESSORIES[day.day];const exercises=[...day.exercises,...(accessory?.type==="exercises"?accessory.exercises:[])];for(const e of exercises){for(let i=0;i<e.sets;i++){if(!getSet(e.id,i).done){const row=document.querySelector(`[data-key="${CSS.escape(setKey(e.id,i))}"]`);row?.scrollIntoView({behavior:"smooth",block:"center"});(row?.querySelector("input")||row?.querySelector(".check"))?.focus();return}}}flash("Workout complete")});
$("#backToWorkout").addEventListener("click",closeExerciseGuide);
$("#retryGuide").addEventListener("click",()=>currentGuideExercise&&openExerciseGuide(currentGuideExercise));
$("#backFromTimer").addEventListener("click",()=>closeTimer());
$("#pauseTimer").addEventListener("click",()=>timerState.running?pauseTimer():startTimer());
$("#restartTimer").addEventListener("click",()=>resetTimer(true));
window.addEventListener("popstate",()=>{if(!$("#timerPage").hidden){closeTimer(false);return}if(!$("#exercisePage").hidden){$("#exercisePage").hidden=true;$("#workoutPage").hidden=false;document.querySelector(".session-footer").hidden=false;$("#settingsBtn").hidden=false;currentGuideExercise=null}});

function registerWebMCP(){const context=document.modelContext;if(!context?.registerTool)return;const register=tool=>Promise.resolve(context.registerTool(tool)).catch(()=>{});
  register({name:"update_workout_set",title:"Update workout set",description:"Set the one-side weight and completion state for a workout set in the selected week and day.",inputSchema:{type:"object",properties:{exerciseId:{type:"string"},setIndex:{type:"integer",minimum:0},weight:{type:["number","string"]},done:{type:"boolean"}},required:["exerciseId","setIndex"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){const phase=phaseForWeek(Number(prefs.week)),day=phase.days[prefs.day],exercise=day.exercises.find(e=>e.id===input.exerciseId);if(!exercise||input.setIndex<0||input.setIndex>=exercise.sets)throw new Error("Exercise or set not found in the selected workout");const patch={};if(input.weight!==undefined){const n=Number(input.weight);if(!Number.isFinite(n)||n<0)throw new Error("Weight must be zero or greater");patch.weight=formatWeight(n)}if(input.done!==undefined)patch.done=input.done;updateSet(exercise.id,input.setIndex,patch);render();return{exercise:exercise.name,set:input.setIndex+1,...getSet(exercise.id,input.setIndex),unit:prefs.unit}}});
  register({name:"read_current_workout",title:"Read current workout",description:"Read the selected plan, week, day, exercises, and saved set progress.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(){const phase=phaseForWeek(Number(prefs.week)),day=phase.days[prefs.day];return{plan:PLANS[prefs.plan].label,week:prefs.week,day:day.day,focus:day.focus,exercises:day.exercises.map(e=>({id:e.id,name:e.name,sets:Array.from({length:e.sets},(_,i)=>({set:i+1,targetReps:e.repTargets[i],...getSet(e.id,i)}))}))}}});
}
registerWebMCP();startWorkout();
