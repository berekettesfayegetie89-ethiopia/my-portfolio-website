class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentTaskId = null;
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        // Add Task Button
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openTaskModal());
        
        // Add Task to Column buttons
        document.querySelectorAll('.add-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const status = e.target.dataset.column;
                this.openTaskModal(status);
            });
        });

        // Modal Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeTaskModal());
        });

        // Task Form Submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterTasks(e.target.value);
        });

        // Priority filter
        document.getElementById('priorityFilter').addEventListener('change', (e) => {
            this.filterTasks(document.getElementById('searchInput').value, e.target.value);
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTasks());

        // Filter button
        document.getElementById('filterBtn').addEventListener('click', () => {
            alert('Advanced filter functionality would open here in a real application');
        });

        // Close modal when clicking outside
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') {
                this.closeTaskModal();
            }
        });

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    openTaskModal(status = 'todo', taskId = null) {
        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTitle');
        
        if (taskId) {
            // Edit existing task
            this.currentTaskId = taskId;
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                modalTitle.textContent = 'Edit Task';
                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskPriority').value = task.priority;
                document.getElementById('taskDueDate').value = task.dueDate || '';
                document.getElementById('taskLabels').value = task.labels ? task.labels.join(', ') : '';
                document.getElementById('taskAssignee').value = task.assignee || '';
                document.getElementById('taskStatus').value = task.status;
                document.getElementById('taskId').value = task.id;
            }
        } else {
            // Create new task
            modalTitle.textContent = 'Add New Task';
            document.getElementById('taskForm').reset();
            document.getElementById('taskStatus').value = status;
            document.getElementById('taskId').value = '';
            document.getElementById('taskDueDate').value = this.getDefaultDueDate();
            this.currentTaskId = null;
        }
        
        modal.classList.add('active');
    }

    closeTaskModal() {
        document.getElementById('taskModal').classList.remove('active');
        document.getElementById('taskForm').reset();
        this.currentTaskId = null;
    }

    getDefaultDueDate() {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    }

    saveTask() {
        const taskData = {
            id: document.getElementById('taskId').value || this.generateId(),
            title: document.getElementById('taskTitle').value.trim(),
            description: document.getElementById('taskDescription').value.trim(),
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value,
            labels: document.getElementById('taskLabels').value
                .split(',')
                .map(label => label.trim())
                .filter(label => label),
            assignee: document.getElementById('taskAssignee').value.trim(),
            status: document.getElementById('taskStatus').value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (!taskData.title) {
            alert('Task title is required');
            return;
        }

        if (this.currentTaskId) {
            // Update existing task
            const index = this.tasks.findIndex(t => t.id === this.currentTaskId);
            if (index !== -1) {
                taskData.createdAt = this.tasks[index].createdAt;
                this.tasks[index] = taskData;
            }
        } else {
            // Add new task
            this.tasks.push(taskData);
        }

        this.saveToLocalStorage();
        this.loadTasks();
        this.closeTaskModal();
        this.updateStats();
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveToLocalStorage();
            this.loadTasks();
            this.updateStats();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        this.clearTaskColumns();
        
        this.tasks.forEach(task => {
            this.createTaskElement(task);
        });
        
        this.updateColumnCounts();
    }

    clearTaskColumns() {
        document.querySelectorAll('.tasks').forEach(column => {
            column.innerHTML = '';
        });
    }

    createTaskElement(task) {
        const column = document.getElementById(`${task.status}-tasks`);
        if (!column) return;

        const taskElement = document.createElement('div');
        taskElement.className = `task priority-${task.priority}`;
        taskElement.dataset.id = task.id;
        taskElement.draggable = true;
        
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        
        taskElement.innerHTML = `
            <div class="task-title">
                <span>${task.title}</span>
                <div class="task-actions">
                    <button class="action-btn edit-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            <div class="task-meta">
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
                <span class="task-due-date">${dueDate}</span>
            </div>
            ${task.assignee ? `<div class="task-assignee">👤 ${task.assignee}</div>` : ''}
            ${task.labels && task.labels.length > 0 ? `
                <div class="task-labels">
                    ${task.labels.map(label => `<span class="label">${label}</span>`).join('')}
                </div>
            ` : ''}
        `;

        // Add event listeners to action buttons
        taskElement.querySelector('.edit-btn').addEventListener('click', () => {
            this.openTaskModal(task.status, task.id);
        });

        taskElement.querySelector('.delete-btn').addEventListener('click', () => {
            this.deleteTask(task.id);
        });

        // Drag and drop events
        taskElement.addEventListener('dragstart', this.handleDragStart.bind(this));
        taskElement.addEventListener('dragend', this.handleDragEnd.bind(this));

        column.appendChild(taskElement);
    }

    updateColumnCounts() {
        const columns = ['todo', 'in-progress', 'review', 'done'];
        columns.forEach(status => {
            const count = this.tasks.filter(task => task.status === status).length;
            const column = document.querySelector(`.column[data-status="${status}"]`);
            if (column) {
                column.querySelector('.task-count').textContent = count;
            }
        });
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.status === 'done').length;
        const inProgressTasks = this.tasks.filter(task => task.status === 'in-progress').length;
        const pendingTasks = this.tasks.filter(task => task.status === 'todo').length;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('inProgressTasks').textContent = inProgressTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
    }

    filterTasks(searchTerm, priorityFilter = 'all') {
        const filteredTasks = this.tasks.filter(task => {
            const matchesSearch = searchTerm === '' || 
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (task.labels && task.labels.some(label => 
                    label.toLowerCase().includes(searchTerm.toLowerCase())));

            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

            return matchesSearch && matchesPriority;
        });

        this.clearTaskColumns();
        filteredTasks.forEach(task => this.createTaskElement(task));
        this.updateColumnCounts();
    }

    exportTasks() {
        const exportData = {
            exportedAt: new Date().toISOString(),
            totalTasks: this.tasks.length,
            tasks: this.tasks
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Drag and Drop Methods
    setupDragAndDrop() {
        const columns = document.querySelectorAll('.column');
        columns.forEach(column => {
            column.addEventListener('dragover', this.handleDragOver.bind(this));
            column.addEventListener('dragenter', this.handleDragEnter.bind(this));
            column.addEventListener('dragleave', this.handleDragLeave.bind(this));
            column.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.target.classList.add('dragging');
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        e.target.style.display = 'block';
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('column') || e.target.closest('.column')) {
            const column = e.target.classList.contains('column') ? e.target : e.target.closest('.column');
            column.classList.add('drop-over');
        }
    }

    handleDragLeave(e) {
        if (e.target.classList.contains('column') || e.target.closest('.column')) {
            const column = e.target.classList.contains('column') ? e.target : e.target.closest('.column');
            if (!column.contains(e.relatedTarget)) {
                column.classList.remove('drop-over');
            }
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const column = e.target.classList.contains('column') ? e.target : e.target.closest('.column');
        column.classList.remove('drop-over');
        
        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = column.dataset.status;
        
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].status = newStatus;
            this.tasks[taskIndex].updatedAt = new Date().toISOString();
            this.saveToLocalStorage();
            this.loadTasks();
            this.updateStats();
        }
    }
}

// Initialize the task manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    
    // Add some sample tasks if none exist
    if (taskManager.tasks.length === 0) {
        const sampleTasks = [
            {
                id: taskManager.generateId(),
                title: 'Implement drag and drop functionality',
                description: 'Add drag and drop support for moving tasks between columns',
                priority: 'high',
                dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                labels: ['feature', 'ui'],
                assignee: 'Alex Chen',
                status: 'done',
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
            },
            {
                id: taskManager.generateId(),
                title: 'Fix mobile responsiveness issues',
                description: 'Some UI elements break on mobile devices',
                priority: 'critical',
                dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                labels: ['bug', 'mobile'],
                assignee: 'Sarah Johnson',
                status: 'in-progress',
                createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: taskManager.generateId(),
                title: 'Add task export functionality',
                description: 'Implement JSON export for all tasks',
                priority: 'medium',
                dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                labels: ['feature', 'export'],
                assignee: '',
                status: 'todo',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
            },
            {
                id: taskManager.generateId(),
                title: 'Write unit tests for task manager',
                description: 'Add comprehensive test coverage for all task operations',
                priority: 'high',
                dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
                labels: ['testing', 'quality'],
                assignee: 'Mike Wilson',
                status: 'review',
                createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
                updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
            }
        ];
        
        taskManager.tasks = sampleTasks;
        taskManager.saveToLocalStorage();
        taskManager.loadTasks();
        taskManager.updateStats();
    }
});