// Todo Task App JavaScript

// DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const tasksCounter = document.getElementById('tasks-counter');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');

// App state
let tasks = [];
let currentFilter = 'all';

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Create a new task
function addTask(text) {
    if (text.trim() === '') return;
    
    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        createdAt: new Date()
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Toggle task completion status
function toggleTaskComplete(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
}

// Clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Filter tasks based on current filter
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Create task HTML element
function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.setAttribute('data-id', task.id);
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'task-delete';
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);
    
    return taskItem;
}

// Render tasks to the DOM
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Clear the task list
    taskList.innerHTML = '';
    
    // Add filtered tasks to the list
    filteredTasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });
    
    // Update tasks counter
    const activeTasks = tasks.filter(task => !task.completed).length;
    tasksCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}

// Change current filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTasks();
}

// Event Listeners
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTask(taskInput.value);
});

taskList.addEventListener('click', function(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = taskItem.getAttribute('data-id');
    
    if (e.target.classList.contains('task-checkbox') || e.target.closest('.task-checkbox')) {
        toggleTaskComplete(taskId);
    }
    
    if (e.target.classList.contains('task-delete') || e.target.closest('.task-delete')) {
        deleteTask(taskId);
    }
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        setFilter(filter);
    });
});

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    
    // Set default filter
    setFilter('all');
});