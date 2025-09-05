class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');
        const todoList = document.getElementById('todoList');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const clearCompletedBtn = document.getElementById('clearCompleted');

        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                this.toggleTodo(e.target.dataset.id);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteTodo(e.target.dataset.id);
            }
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        
        if (text === '') return;

        const todo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.render();
        this.updateStats();
        input.value = '';
        input.focus();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
            this.updateStats();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
        this.updateStats();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update filter button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
        this.updateStats();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item">
                <input type="checkbox" 
                       class="todo-checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       data-id="${todo.id}">
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" data-id="${todo.id}">×</button>
            </li>
        `).join('');
    }

    updateStats() {
        const taskCount = document.getElementById('taskCount');
        const clearCompletedBtn = document.getElementById('clearCompleted');
        const totalTasks = this.todos.length;
        const completedTasks = this.todos.filter(todo => todo.completed).length;
        const activeTasks = totalTasks - completedTasks;

        let countText = '';
        if (totalTasks === 0) {
            countText = 'No tasks';
        } else if (activeTasks === 0) {
            countText = 'All done! 🎉';
        } else if (completedTasks === 0) {
            countText = `${activeTasks} task${activeTasks !== 1 ? 's' : ''}`;
        } else {
            countText = `${activeTasks} active, ${completedTasks} completed`;
        }

        taskCount.textContent = countText;
        clearCompletedBtn.disabled = completedTasks === 0;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});