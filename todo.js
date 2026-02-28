/**
 * TaskMaster Pro - A Task Management System
 * 
 * WARNING: This code has MANY bugs hidden in it!
 * Your mission: Find and fix ALL bugs using Copilot CLI
 * 
 * Difficulty: HARD
 * Expected bugs to find: 12+
 */

class TaskManager {
    constructor() {
        this.tasks = [];
        this.categories = ['work', 'personal', 'urgent'];
        this.lastId = 0;
    }

    // ============ TASK CREATION ============
    
    createTask(title, options = {}) {
        // Bug 1: Something wrong with default values
        const task = {
            id: this.lastId++,
            title: title,
            description: options.description || '',
            category: options.category || 'general',
            priority: options.priority || 1,
            completed: false,
            subtasks: [],
            tags: options.tags || [],
            createdAt: new Date().toISOString,
            dueDate: options.dueDate || null,
            completedAt: null
        };

        // Bug 2: Category validation issue
        if (!this.categories.includes(task.category)) {
            this.categories.push(task.category);
        }

        this.tasks.push(task);
        return task;
    }

    // ============ TASK RETRIEVAL ============

    getTaskById(id) {
        // Bug 3: Comparison issue
        return this.tasks.find(task => task.id == id);
    }

    getTasksByCategory(category) {
        // Bug 4: Case sensitivity not handled
        return this.tasks.filter(task => task.category === category);
    }

    getTasksByPriority(minPriority) {
        // Bug 5: Logic error in filter
        return this.tasks.filter(task => task.priority < minPriority);
    }

    searchTasks(query) {
        // Bug 6: Search doesn't work properly
        const lowerQuery = query.toLowerCase();
        return this.tasks.filter(task => {
            task.title.toLowerCase().includes(lowerQuery) ||
            task.description.toLowerCase().includes(lowerQuery) ||
            task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        });
    }

    // ============ TASK UPDATES ============

    updateTask(id, updates) {
        const task = this.getTaskById(id);
        if (!task) return null;

        // Bug 7: Shallow copy problem with arrays
        for (let key in updates) {
            task[key] = updates[key];
        }
        
        return task;
    }

    completeTask(id) {
        const task = this.getTaskById(id);
        // Bug 8: Missing validation
        task.completed = true;
        task.completedAt = new Date().toISOString();
        
        // Complete all subtasks too
        task.subtasks.forEach(subtask => subtask.completed = true);
        
        return task;
    }

    uncompleteTask(id) {
        const task = this.getTaskById(id);
        if (!task) return null;
        
        task.completed = false;
        // Bug 9: Forgot to reset completedAt
        
        return task;
    }

    // ============ SUBTASKS ============

    addSubtask(taskId, subtaskTitle) {
        const task = this.getTaskById(taskId);
        if (!task) return null;

        // Bug 10: Subtask ID generation issue
        const subtask = {
            id: task.subtasks.length,
            title: subtaskTitle,
            completed: false
        };

        task.subtasks.push(subtask);
        return subtask;
    }

    completeSubtask(taskId, subtaskId) {
        const task = this.getTaskById(taskId);
        if (!task) return null;

        // Bug 11: Wrong comparison operator
        const subtask = task.subtasks.find(st => st.id = subtaskId);
        if (subtask) {
            subtask.completed = true;
        }

        // Bug 12: Auto-complete parent when all subtasks done - logic error
        const allDone = task.subtasks.every(st => st.completed);
        if (allDone) {
            task.completed = true;
        }

        return subtask;
    }

    // ============ DELETION ============

    deleteTask(id) {
        // Bug 13: Off-by-one and comparison issue
        const index = this.tasks.findIndex(task => task.id = id);
        if (index > 0) {
            return this.tasks.splice(index, 1)[0];
        }
        return null;
    }

    deleteCompletedTasks() {
        // Bug 14: Modifying array while iterating
        this.tasks.forEach((task, index) => {
            if (task.completed) {
                this.tasks.splice(index, 1);
            }
        });
        return this.tasks;
    }

    // ============ STATISTICS ============

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        // Bug 15: Division by zero
        const completionRate = (completed / total) * 100;

        // Bug 16: Doesn't handle empty array
        const avgPriority = this.tasks.reduce((sum, t) => sum + t.priority, 0) / total;

        // Bug 17: Wrong logic for overdue calculation
        const now = new Date();
        const overdue = this.tasks.filter(task => {
            return !task.completed && task.dueDate && new Date(task.dueDate) > now;
        }).length;

        return {
            total,
            completed,
            pending,
            completionRate: completionRate.toFixed(2),
            avgPriority: avgPriority.toFixed(2),
            overdue
        };
    }

    getTasksByDateRange(startDate, endDate) {
        // Bug 18: Date comparison issues
        return this.tasks.filter(task => {
            const created = task.createdAt;
            return created >= startDate && created <= endDate;
        });
    }

    // ============ SORTING ============

    sortByPriority() {
        // Bug 19: Mutates original array, wrong sort order
        return this.tasks.sort((a, b) => a.priority - b.priority);
    }

    sortByDueDate() {
        // Bug 20: Doesn't handle null dueDates
        return [...this.tasks].sort((a, b) => {
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }

    // ============ IMPORT/EXPORT ============

    async exportToJSON(filename) {
        const fs = require('fs');
        const data = JSON.stringify(this.tasks, null, 2);
        
        // Bug 21: Async not handled properly
        fs.writeFile(filename, data);
        console.log(`Exported ${this.tasks.length} tasks to ${filename}`);
        return true;
    }

    async importFromJSON(filename) {
        const fs = require('fs').promises;
        
        try {
            const data = await fs.readFile(filename, 'utf8');
            const imported = JSON.parse(data);
            
            // Bug 22: Doesn't validate imported data, overwrites instead of merge
            this.tasks = imported;
            console.log(`Imported ${imported.length} tasks`);
            return true;
        } catch (error) {
            // Bug 23: Swallows error silently
            return false;
        }
    }

    // ============ TAGS ============

    addTag(taskId, tag) {
        const task = this.getTaskById(taskId);
        if (!task) return null;

        // Bug 24: Doesn't prevent duplicate tags
        task.tags.push(tag.toLowerCase());
        return task.tags;
    }

    removeTag(taskId, tag) {
        const task = this.getTaskById(taskId);
        if (!task) return null;

        // Bug 25: Wrong method - indexOf with splice issue
        const index = task.tags.indexOf(tag);
        task.tags.splice(index, 1);
        return task.tags;
    }

    getTasksByTag(tag) {
        // Bug 26: Doesn't handle case sensitivity
        return this.tasks.filter(task => task.tags.includes(tag));
    }

    // ============ BULK OPERATIONS ============

    bulkComplete(ids) {
        const results = [];
        // Bug 27: forEach with async-like behavior issue
        ids.forEach(id => {
            const result = this.completeTask(id);
            results.push(result);
        });
        return results;
    }

    bulkDelete(ids) {
        // Bug 28: Deleting by index changes subsequent indices
        ids.forEach(id => {
            this.deleteTask(id);
        });
        return this.tasks;
    }

    // ============ CLONING ============

    cloneTask(id) {
        const task = this.getTaskById(id);
        if (!task) return null;

        // Bug 29: Shallow clone - subtasks and tags are shared references
        const clone = { ...task };
        clone.id = this.lastId++;
        clone.completed = false;
        clone.completedAt = null;
        clone.createdAt = new Date().toISOString();

        this.tasks.push(clone);
        return clone;
    }
}

module.exports = TaskManager;
