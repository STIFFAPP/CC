/* Keep gym/exercise as a core Life Manager routine across every schedule template. */
(() => {
  const previousGetTasks = getTasks;
  const gymByTemplate = {
    night: { start:-240,end:-150,title:'Gym / exercise — before work' },
    early: { start:790,end:880,title:'Gym / exercise — after work' },
    day: { start:555,end:645,title:'Gym / exercise — after work' },
    late: { start:-235,end:-145,title:'Gym / exercise — before work' },
    off: { start:300,end:420,title:'Gym / exercise' },
    recovery: { start:420,end:480,title:'Optional gym / recovery exercise' },
    project: { start:375,end:465,title:'Gym / exercise — project break' },
    reset: { start:450,end:540,title:'Gym / exercise' }
  };
  function minutes(time){const [h,m]=time.split(':').map(Number);return h*60+m}
  function clock(value){value=((value%1440)+1440)%1440;return String(Math.floor(value/60)).padStart(2,'0')+':'+String(value%60).padStart(2,'0')}
  getTasks=function(day){const tasks=previousGetTasks(day);if(!day||!day.template||!gymByTemplate[day.template])return tasks;if(tasks.some(task=>/gym/i.test(task[2]||'')))return tasks;const gym=gymByTemplate[day.template],anchor=minutes(day.anchor||'08:00');const gymTask=[clock(anchor+gym.start),clock(anchor+gym.end),gym.title,[],day.template==='recovery'?'Keep this optional. Choose mobility, light cardio or a normal session only if recovery feels good.':'Core training block. Move it if needed rather than deleting it.'];const combined=[...tasks,gymTask];combined.sort((a,b)=>minutes(a[0])-minutes(b[0]));return combined};
  const extra=document.createElement('script');extra.src='schedule-adjustments.js';document.head.appendChild(extra);
})();