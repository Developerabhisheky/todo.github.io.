// Vanilla JS To‑Do App (front‑end only)
// Features: add, toggle complete, delete, localStorage persistence, filters

(() => {
  const input = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');
  const list = document.getElementById('todo-list');
  const filters = document.querySelectorAll('.filter');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const countAll = document.getElementById('count-all');
  const countActive = document.getElementById('count-active');
  const countCompleted = document.getElementById('count-completed');

  const STORAGE_KEY = 'vanilla_todo_tasks_v1';

  /** @type {{id:number, text:string, completed:boolean}[]} */
  let tasks = [];

  // Load from localStorage
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch {
      tasks = [];
    }
  }

  // Save to localStorage
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Create a task object
  function createTask(text) {
    return { id: Date.now() + Math.floor(Math.random()*1000), text, completed: false };
  }

  // Render list based on active filter
  function render() {
    const activeFilter = document.querySelector('.filter.is-active')?.dataset.filter || 'all';
    list.innerHTML = '';
    let filtered = tasks;
    if (activeFilter === 'active') filtered = tasks.filter(t => !t.completed);
    if (activeFilter === 'completed') filtered = tasks.filter(t => t.completed);

    for (const t of filtered) {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = t.id;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = t.completed;
      cb.setAttribute('aria-label', 'Mark complete');

      const span = document.createElement('span');
      span.className = 'todo-text' + (t.completed ? ' completed' : '');
      span.textContent = t.text;

      const del = document.createElement('button');
      del.className = 'del-btn';
      del.textContent = 'Delete';
      del.setAttribute('aria-label', 'Delete task');

      li.append(cb, span, del);
      list.appendChild(li);
    }

    // update counts
    countAll.textContent = String(tasks.length);
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.length - active;
    countActive.textContent = String(active);
    countCompleted.textContent = String(completed);
  }

  // Add task
  function addTask() {
    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }
    tasks.unshift(createTask(text));
    input.value = '';
    save();
    render();
    input.focus();
  }

  // Toggle completion
  function toggleTask(id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx > -1) {
      tasks[idx].completed = !tasks[idx].completed;
      save();
      render();
    }
  }

  // Delete task
  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }

  // Clear completed
  function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    save();
    render();
  }

  // ===== Event Listeners =====
  addBtn.addEventListener('click', addTask);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Event delegation for list (toggle & delete)
  list.addEventListener('click', (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.matches('input[type="checkbox"]')) {
      toggleTask(id);
    } else if (e.target.matches('.del-btn')) {
      deleteTask(id);
    }
  });

  // Filters
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      render();
    });
  });

  // Clear completed
  clearCompletedBtn.addEventListener('click', clearCompleted);

  // Init
  load();
  render();
})();