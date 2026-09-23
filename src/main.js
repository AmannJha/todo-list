import './style.css';

const STORAGE_KEY = 'daymark-tasks';
const starterTasks = [
  { id: crypto.randomUUID(), text: 'Choose the three things that matter today', completed: true },
  { id: crypto.randomUUID(), text: 'Make time for a proper lunch', completed: false },
  { id: crypto.randomUUID(), text: 'Send the kind message I have been meaning to write', completed: false },
];

let tasks = loadTasks();
let activeFilter = 'all';

const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const emptyTitle = document.querySelector('#empty-title');
const emptyCopy = document.querySelector('#empty-copy');
const taskCount = document.querySelector('#task-count');
const progressValue = document.querySelector('#progress-value');
const progressRing = document.querySelector('#progress-ring');
const filterButtons = document.querySelectorAll('.filter-button');
const clearCompletedButton = document.querySelector('#clear-completed');

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);
  if (savedTasks) {
    try {
      return JSON.parse(savedTasks);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return starterTasks;
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getVisibleTasks() {
  if (activeFilter === 'active') return tasks.filter((task) => !task.completed);
  if (activeFilter === 'completed') return tasks.filter((task) => task.completed);
  return tasks;
}

function render() {
  const visibleTasks = getVisibleTasks();
  const completedCount = tasks.filter((task) => task.completed).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  taskCount.textContent = tasks.filter((task) => !task.completed).length;
  progressValue.textContent = `${progress}%`;
  progressRing.style.setProperty('--progress', `${progress * 3.6}deg`);
  progressRing.setAttribute('aria-label', `${progress}% complete`);
  clearCompletedButton.disabled = completedCount === 0;

  taskList.innerHTML = visibleTasks.map((task) => `
    <article class="task-item ${task.completed ? 'is-complete' : ''}" data-id="${task.id}">
      <button class="check-button" type="button" aria-label="${task.completed ? 'Mark as open' : 'Mark as complete'}" title="${task.completed ? 'Mark as open' : 'Mark as complete'}"></button>
      <span class="task-text">${escapeHtml(task.text)}</span>
      <button class="delete-button" type="button" aria-label="Delete task" title="Delete task">×</button>
    </article>
  `).join('');

  const hasTasks = visibleTasks.length > 0;
  emptyState.hidden = hasTasks;
  if (!hasTasks) {
    emptyTitle.textContent = activeFilter === 'completed' ? 'No finished tasks' : activeFilter === 'active' ? 'You are all caught up' : 'Nothing here yet';
    emptyCopy.textContent = activeFilter === 'completed' ? 'Completed tasks will collect here.' : activeFilter === 'active' ? 'A little breathing room. Enjoy it.' : 'Add one small thing and start there.';
  }

  filterButtons.forEach((button) => button.classList.toggle('active', button.dataset.filter === activeFilter));
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.unshift({ id: crypto.randomUUID(), text, completed: false });
  saveTasks();
  taskInput.value = '';
  render();
  taskInput.focus();
});

taskList.addEventListener('click', (event) => {
  const taskItem = event.target.closest('.task-item');
  if (!taskItem) return;
  const task = tasks.find((item) => item.id === taskItem.dataset.id);
  if (!task) return;
  if (event.target.closest('.check-button')) task.completed = !task.completed;
  if (event.target.closest('.delete-button')) tasks = tasks.filter((item) => item.id !== task.id);
  saveTasks();
  render();
});

filterButtons.forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  render();
}));

clearCompletedButton.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

render();
