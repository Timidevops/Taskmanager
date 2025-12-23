// Task Manager Pro - Enhanced JavaScript

const API_BASE_URL = '/api/tasks';
let tasks = [];
let currentFilter = 'all';
let detailTask = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    if (document.getElementById('taskTable')) {
        loadTasks();
    }
    
    if (document.getElementById('taskDetailCard')) {
        loadTaskDetails();
    }
    
    setupEventListeners();
}

function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }
}

function setupEventListeners() {
    // Add task form
    const addForm = document.getElementById('addTaskForm');
    if (addForm) {
        addForm.addEventListener('submit', handleAddTask);
    }
    
    // Edit task form
    const editForm = document.getElementById('editTaskForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditTask);
        loadTaskForEdit();
    }

    // Detail page buttons
    const toggleBtn = document.getElementById('detailToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', handleDetailToggleStatus);
    }

    const deleteBtn = document.getElementById('detailDeleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDetailDelete);
    }
}

function loadTasks() {
    fetch(API_BASE_URL)
        .then(response => response.json())
        .then(data => {
            tasks = data;
            displayTasks(tasks);
            updateStats();
        })
        .catch(error => {
            console.error('Error loading tasks:', error);
            showError('Failed to load tasks');
        });
}

function displayTasks(tasksToShow) {
    const tbody = document.querySelector('#taskTable tbody');
    const emptyState = document.getElementById('emptyState');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (tasksToShow.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    tasksToShow.forEach(task => {
        const row = createTaskRow(task);
        tbody.appendChild(row);
    });
}

function createTaskRow(task) {
    const row = document.createElement('tr');
    row.className = 'animate-fade-in';
    
    const statusBadge = task.completed 
        ? '<span class="status-badge status-completed"><i class="fas fa-check me-1"></i>Completed</span>'
        : '<span class="status-badge status-pending"><i class="fas fa-clock me-1"></i>Pending</span>';
    
    row.innerHTML = `
        <td class="fw-bold">#${task.id}</td>
        <td>
            <div class="d-flex align-items-center">
                <i class="fas fa-file-alt text-primary me-2"></i>
                <a href="task-details.html?id=${task.id}" class="text-decoration-none ${task.completed ? 'text-decoration-line-through text-muted' : ''}">
                    ${escapeHtml(task.title)}
                </a>
            </div>
        </td>
        <td>
            <div class="text-muted small">
                ${escapeHtml(task.description) || '<em>No description</em>'}
            </div>
        </td>
        <td>${statusBadge}</td>
        <td>
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-secondary" onclick="viewTask(${task.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-primary" onclick="editTask(${task.id})" title="Edit Task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-${task.completed ? 'warning' : 'success'}" 
                        onclick="toggleTaskStatus(${task.id})" 
                        title="${task.completed ? 'Mark as Pending' : 'Mark as Completed'}">
                    <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})" title="Delete Task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    updateElement('totalTasks', total);
    updateElement('completedTasks', completed);
    updateElement('pendingTasks', pending);
    updateElement('progressPercent', progress + '%');
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        element.classList.add('animate-pulse');
        setTimeout(() => element.classList.remove('animate-pulse'), 1000);
    }
}

function handleAddTask(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const task = {
        title: formData.get('title'),
        description: formData.get('description'),
        completed: formData.get('completed') === 'on'
    };
    
    if (!task.title.trim()) {
        showError('Task title is required');
        return;
    }
    
    fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(data => {
        showSuccess('Task created successfully!');
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    })
    .catch(error => {
        console.error('Error creating task:', error);
        showError('Failed to create task');
    });
}

function handleEditTask(event) {
    event.preventDefault();
    
    const taskId = document.getElementById('taskId').value;
    const formData = new FormData(event.target);
    const task = {
        title: formData.get('title'),
        description: formData.get('description'),
        completed: formData.get('completed') === 'on'
    };
    
    if (!task.title.trim()) {
        showError('Task title is required');
        return;
    }
    
    fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(data => {
        showSuccess('Task updated successfully!');
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    })
    .catch(error => {
        console.error('Error updating task:', error);
        showError('Failed to update task');
    });
}

function loadTaskForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    
    if (!taskId) {
        showError('Task ID not provided');
        return;
    }
    
    fetch(`${API_BASE_URL}/${taskId}`)
        .then(response => response.json())
        .then(task => {
            document.getElementById('taskId').value = task.id;
            document.getElementById('editTitle').value = task.title;
            document.getElementById('editDescription').value = task.description || '';
            document.getElementById('editCompleted').checked = task.completed;
        })
        .catch(error => {
            console.error('Error loading task:', error);
            showError('Failed to load task');
        });
}

function editTask(id) {
    window.location.href = `edit-task.html?id=${id}`;
}

function viewTask(id) {
    window.location.href = `task-details.html?id=${id}`;
}

function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const updatedTask = {
        ...task,
        completed: !task.completed
    };
    
    fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    })
    .then(response => response.json())
    .then(data => {
        loadTasks();
        showSuccess(`Task marked as ${updatedTask.completed ? 'completed' : 'pending'}!`);
    })
    .catch(error => {
        console.error('Error updating task:', error);
        showError('Failed to update task status');
    });
}

function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        loadTasks();
        showSuccess('Task deleted successfully!');
    })
    .catch(error => {
        console.error('Error deleting task:', error);
        showError('Failed to delete task');
    });
}

function loadTaskDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    
    if (!taskId) {
        showError('Task ID not provided');
        return;
    }

    fetch(`${API_BASE_URL}/${taskId}`)
        .then(response => response.json())
        .then(task => {
            detailTask = task;
            document.getElementById('detailId').textContent = `#${task.id}`;
            document.getElementById('detailTitle').textContent = task.title;
            document.getElementById('detailDescription').innerHTML = escapeHtml(task.description) || '<em>No description</em>';
            document.getElementById('detailEditLink').href = `edit-task.html?id=${task.id}`;
            renderDetailStatus(task.completed);
        })
        .catch(error => {
            console.error('Error loading task:', error);
            showError('Failed to load task details');
        });
}

function renderDetailStatus(completed) {
    const statusContainer = document.getElementById('detailStatus');
    const toggleBtn = document.getElementById('detailToggleBtn');
    if (!statusContainer || !toggleBtn) return;

    statusContainer.innerHTML = completed
        ? '<span class="status-badge status-completed"><i class="fas fa-check me-1"></i>Completed</span>'
        : '<span class="status-badge status-pending"><i class="fas fa-clock me-1"></i>Pending</span>';

    toggleBtn.className = `btn btn-${completed ? 'warning' : 'success'}`;
    toggleBtn.innerHTML = completed
        ? '<i class="fas fa-undo me-2"></i>Mark Pending'
        : '<i class="fas fa-check me-2"></i>Mark Completed';
}

function handleDetailToggleStatus() {
    if (!detailTask) return;
    const updatedTask = {
        ...detailTask,
        completed: !detailTask.completed
    };

    fetch(`${API_BASE_URL}/${detailTask.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    })
    .then(response => response.json())
    .then(data => {
        detailTask = updatedTask;
        renderDetailStatus(updatedTask.completed);
        showSuccess(`Task marked as ${updatedTask.completed ? 'completed' : 'pending'}!`);
    })
    .catch(error => {
        console.error('Error updating task status:', error);
        showError('Failed to update task status');
    });
}

function handleDetailDelete() {
    if (!detailTask) return;
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    fetch(`${API_BASE_URL}/${detailTask.id}`, {
        method: 'DELETE'
    })
    .then(() => {
        showSuccess('Task deleted successfully!');
        setTimeout(() => window.location.href = '/', 1200);
    })
    .catch(error => {
        console.error('Error deleting task:', error);
        showError('Failed to delete task');
    });
}

function filterTasks(filter) {
    currentFilter = filter;
    let filteredTasks = tasks;
    
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    displayTasks(filteredTasks);
}

function scrollToTasks() {
    document.getElementById('tasksSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function showSuccess(message) {
    showAlert(message, 'success');
}

function showError(message) {
    showAlert(message, 'danger');
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
