(() => {
  const KEY = 'hub-project-hq-v1';
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let projects = [];
  function load() {
    try { const data = JSON.parse(localStorage.getItem(KEY) || '[]'); projects = Array.isArray(data) ? data : []; }
    catch { projects = []; }
    render();
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(projects)); render(); }
  function render() {
    $('activeCount').textContent = projects.length;
    $('doneCount').textContent = projects.reduce((sum, project) => sum + project.tasks.filter(task => task.done).length, 0);
    $('projectCount').textContent = `${projects.length} total`;
    $('projects').innerHTML = projects.length ? projects.map(project => `<article class="project" data-id="${escape(project.id)}">
      <div class="project-top"><div><h3>${escape(project.name)}</h3><p>${project.tasks.filter(t => t.done).length} of ${project.tasks.length} actions done. One step is enough today.</p></div><button class="quiet" type="button" data-action="rename">Rename</button></div>
      <form class="task-form add-row" data-form="task"><input aria-label="New action for ${escape(project.name)}" name="task" maxlength="160" placeholder="What is the next small action?" required><button>Add action</button></form>
      <ul class="task-list">${project.tasks.map(task => `<li data-task="${escape(task.id)}"><label><input type="checkbox" data-action="toggle" ${task.done ? 'checked' : ''}><span class="${task.done ? 'done' : ''}">${escape(task.text)}</span></label><button class="quiet small" type="button" data-action="delete-task" aria-label="Remove ${escape(task.text)}">Remove</button></li>`).join('')}</ul>
      <div class="project-footer"><button class="danger small" type="button" data-action="delete-project">Delete project</button></div></article>`).join('') : '<div class="empty"><strong>A fresh start.</strong><p>Add one project above. You can fill in the steps as you go.</p></div>';
  }
  const id = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  $('projectForm').addEventListener('submit', event => { event.preventDefault(); const input = $('projectName'); const name = input.value.trim(); if (!name) return; projects.unshift({id:id(),name,tasks:[]}); input.value = ''; save(); });
  $('projects').addEventListener('submit', event => { if (!event.target.matches('[data-form="task"]')) return; event.preventDefault(); const project = projects.find(x => x.id === event.target.closest('[data-id]').dataset.id); const input = event.target.elements.task; const text = input.value.trim(); if (!project || !text) return; project.tasks.push({id:id(),text,done:false}); save(); });
  $('projects').addEventListener('change', event => { if (event.target.dataset.action !== 'toggle') return; const project = projects.find(x => x.id === event.target.closest('[data-id]').dataset.id); const task = project?.tasks.find(x => x.id === event.target.closest('[data-task]').dataset.task); if (task) { task.done = event.target.checked; save(); } });
  $('projects').addEventListener('click', event => { const action = event.target.dataset.action; if (!action || action === 'toggle') return; const project = projects.find(x => x.id === event.target.closest('[data-id]').dataset.id); if (!project) return;
    if (action === 'rename') { const name = prompt('Project name', project.name)?.trim(); if (name) { project.name = name.slice(0,100); save(); } }
    if (action === 'delete-task') { const task = project.tasks.find(x => x.id === event.target.closest('[data-task]').dataset.task); if (task && confirm(`Remove “${task.text}”?`)) { project.tasks = project.tasks.filter(x => x !== task); save(); } }
    if (action === 'delete-project' && confirm(`Delete “${project.name}” and all its actions?`)) { projects = projects.filter(x => x !== project); save(); }
  });
  $('syncStatus').textContent = window.KBCloud?.isSignedIn?.() ? 'Saved to your Hub account and synced across devices.' : 'Saved on this device. Sign in at the Hub to sync across devices.';
  window.addEventListener('kb-cloud-loaded', load);
  load();
})();
