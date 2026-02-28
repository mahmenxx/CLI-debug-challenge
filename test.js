/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        🐛 BUG HUNT CHALLENGE 🐛
 *                          TaskMaster Pro Tests
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * INSTRUCTIONS:
 * 1. Run this file: node test.js
 * 2. Each test shows: EXPECTED vs ACTUAL
 * 3. If they don't match → there's a bug in todo.js
 * 4. Use Copilot CLI to find and fix bugs
 * 5. Keep running tests until ALL PASS ✓
 * 
 * SCORING:
 * - Each test is worth 5 points
 * - Total: 100 points
 * - First to reach 100 wins!
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const TaskManager = require('./todo.js');

let passed = 0;
let failed = 0;

function test(name, expected, actual, hint = '') {
    const pass = JSON.stringify(expected) === JSON.stringify(actual);
    
    if (pass) {
        console.log(`✅ PASS: ${name}`);
        passed++;
    } else {
        console.log(`❌ FAIL: ${name}`);
        console.log(`   EXPECTED: ${JSON.stringify(expected)}`);
        console.log(`   ACTUAL:   ${JSON.stringify(actual)}`);
        if (hint) console.log(`   💡 HINT:  ${hint}`);
        failed++;
    }
    console.log('');
}

function section(title) {
    console.log('\n' + '═'.repeat(60));
    console.log(`  ${title}`);
    console.log('═'.repeat(60) + '\n');
}

// ═══════════════════════════════════════════════════════════════════════════
//                              START TESTS
// ═══════════════════════════════════════════════════════════════════════════

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║                    🔍 TASKMASTER PRO - BUG HUNT 🔍                        ║
║                                                                           ║
║  Find all the bugs in todo.js to make these tests pass!                   ║
║  Use: copilot → "@todo.js find and fix all bugs"                          ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

// ============================================================================
section('TEST 1-3: Task Creation');
// ============================================================================

const tm1 = new TaskManager();
const task1 = tm1.createTask('Test Task', { 
    description: 'A test', 
    priority: 2,
    tags: ['important']
});

// Test 1: createdAt should be a valid date string
test(
    'createdAt should be a valid ISO date string',
    true,
    typeof task1.createdAt === 'string' && !isNaN(Date.parse(task1.createdAt)),
    'Check how createdAt is assigned - is the function being called?'
);

// Test 2: Invalid category should NOT be added to categories list automatically
const tm2 = new TaskManager();
const originalCategoriesCount = tm2.categories.length;
tm2.createTask('Task with bad category', { category: 'invalid-category' });
test(
    'Invalid categories should be rejected, not added',
    originalCategoriesCount,
    tm2.categories.length,
    'Should the app accept ANY category? Or validate against existing ones?'
);

// Test 3: Tags should be a separate copy, not shared reference
const originalTags = ['work'];
const tm3 = new TaskManager();
const taskWithTags = tm3.createTask('Tag test', { tags: originalTags });
taskWithTags.tags.push('modified');
test(
    'Modifying task tags should not affect original array',
    1,
    originalTags.length,
    'Array references can be tricky - look at how tags are assigned'
);

// ============================================================================
section('TEST 4-6: Task Retrieval');
// ============================================================================

const tm4 = new TaskManager();
tm4.createTask('Work stuff', { category: 'WORK' });  // Uppercase
tm4.createTask('More work', { category: 'work' });   // Lowercase
tm4.createTask('Personal', { category: 'personal' });

// Test 4: Category search should be case-insensitive
test(
    'getTasksByCategory should be case-insensitive',
    2,
    tm4.getTasksByCategory('work').length,
    'Users might type "WORK", "Work", or "work" - all should match'
);

// Test 5: Priority filter should return tasks >= minPriority
const tm5 = new TaskManager();
tm5.createTask('Low priority', { priority: 1 });
tm5.createTask('Medium priority', { priority: 5 });
tm5.createTask('High priority', { priority: 10 });
test(
    'getTasksByPriority(5) should return tasks with priority >= 5',
    2,
    tm5.getTasksByPriority(5).length,
    'Check the comparison operator - greater than or less than?'
);

// Test 6: Search should actually return results
const tm6 = new TaskManager();
tm6.createTask('Buy groceries', { description: 'milk, eggs, bread' });
tm6.createTask('Call mom', { tags: ['family', 'important'] });
test(
    'searchTasks should find tasks matching query',
    1,
    tm6.searchTasks('groceries').length,
    'The filter function needs to RETURN something'
);

// ============================================================================
section('TEST 7-9: Task Updates');
// ============================================================================

const tm7 = new TaskManager();
const updateTask = tm7.createTask('Update me', { tags: ['original'] });
const newTags = ['new-tag'];
tm7.updateTask(updateTask.id, { tags: newTags });
newTags.push('should-not-appear');
test(
    'Updated tags should be a copy, not reference',
    1,
    tm7.getTaskById(updateTask.id).tags.length,
    'When updating arrays, should we copy or reference?'
);

// Test 8: completeTask should handle non-existent task
const tm8 = new TaskManager();
let errorThrown = false;
try {
    tm8.completeTask(999);  // ID doesn't exist
} catch (e) {
    errorThrown = true;
}
test(
    'completeTask on non-existent task should not crash',
    false,
    errorThrown,
    'What happens when getTaskById returns null?'
);

// Test 9: uncompleteTask should reset completedAt
const tm9 = new TaskManager();
const taskToUncomplete = tm9.createTask('Complete then uncomplete');
tm9.completeTask(taskToUncomplete.id);
tm9.uncompleteTask(taskToUncomplete.id);
test(
    'uncompleteTask should reset completedAt to null',
    null,
    tm9.getTaskById(taskToUncomplete.id).completedAt,
    'When uncompleting, what else needs to be reset?'
);

// ============================================================================
section('TEST 10-12: Subtasks');
// ============================================================================

const tm10 = new TaskManager();
const parentTask = tm10.createTask('Parent task');
tm10.addSubtask(parentTask.id, 'Subtask 1');
tm10.addSubtask(parentTask.id, 'Subtask 2');
tm10.deleteTask(parentTask.id);  // This might have bugs
const rebornParent = tm10.createTask('New parent');
const newSubtask = tm10.addSubtask(rebornParent.id, 'New subtask');
test(
    'Subtask IDs should be unique within a task',
    0,
    newSubtask.id,
    'After deletion and recreation, subtask ID should reset'
);

// Test 11: completeSubtask should find the right subtask
const tm11 = new TaskManager();
const taskWithSubs = tm11.createTask('Has subtasks');
tm11.addSubtask(taskWithSubs.id, 'First');
tm11.addSubtask(taskWithSubs.id, 'Second');
tm11.addSubtask(taskWithSubs.id, 'Third');
tm11.completeSubtask(taskWithSubs.id, 1);  // Complete "Second"
const subtasks = tm11.getTaskById(taskWithSubs.id).subtasks;
const completedCount = subtasks.filter(s => s.completed).length;
test(
    'Only the targeted subtask should be completed',
    1,
    completedCount,
    'Check the find comparison - assignment vs equality?'
);

// Test 12: Parent should only complete when ALL subtasks are done
const tm12 = new TaskManager();
const autoCompleteTask = tm12.createTask('Should not auto-complete yet');
tm12.addSubtask(autoCompleteTask.id, 'Sub 1');
tm12.addSubtask(autoCompleteTask.id, 'Sub 2');
tm12.completeSubtask(autoCompleteTask.id, 0);  // Only complete first
test(
    'Task should NOT auto-complete when only some subtasks are done',
    false,
    tm12.getTaskById(autoCompleteTask.id).completed,
    'When does Bug 11 cause this to fail?'
);

// ============================================================================
section('TEST 13-14: Deletion');
// ============================================================================

const tm13 = new TaskManager();
tm13.createTask('Task 0');  // ID: 0
tm13.createTask('Task 1');  // ID: 1
tm13.createTask('Task 2');  // ID: 2
const deleted = tm13.deleteTask(0);  // Delete first task
test(
    'Should be able to delete task with ID 0',
    'Task 0',
    deleted ? deleted.title : null,
    'Is index 0 being handled correctly?'
);

// Test 14: deleteCompletedTasks should remove ALL completed
const tm14 = new TaskManager();
tm14.createTask('Keep 1');
const c1 = tm14.createTask('Complete 1'); tm14.completeTask(c1.id);
const c2 = tm14.createTask('Complete 2'); tm14.completeTask(c2.id);
tm14.createTask('Keep 2');
const c3 = tm14.createTask('Complete 3'); tm14.completeTask(c3.id);
tm14.deleteCompletedTasks();
test(
    'All completed tasks should be deleted',
    2,
    tm14.tasks.length,
    'Modifying array while iterating causes issues - try filter instead'
);

// ============================================================================
section('TEST 15-16: Statistics');
// ============================================================================

const tm15 = new TaskManager();  // Empty task manager
const emptyStats = tm15.getStats();
test(
    'Stats should handle empty task list (no NaN)',
    false,
    isNaN(parseFloat(emptyStats.completionRate)) || isNaN(parseFloat(emptyStats.avgPriority)),
    'What happens when you divide by zero?'
);

// Test 16: Overdue calculation
const tm16 = new TaskManager();
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
tm16.createTask('Past due', { dueDate: yesterday });
tm16.createTask('Not due yet', { dueDate: tomorrow });
tm16.createTask('No due date');
test(
    'Should correctly identify overdue tasks',
    1,
    tm16.getStats().overdue,
    'Overdue means due date is IN THE PAST, not future'
);

// ============================================================================
section('TEST 17-18: Sorting');
// ============================================================================

const tm17 = new TaskManager();
tm17.createTask('Low', { priority: 1 });
tm17.createTask('High', { priority: 10 });
tm17.createTask('Medium', { priority: 5 });

const originalOrder = tm17.tasks.map(t => t.title);
const sorted = tm17.sortByPriority();
const stillOriginal = tm17.tasks.map(t => t.title);

test(
    'sortByPriority should NOT mutate original array',
    JSON.stringify(originalOrder),
    JSON.stringify(stillOriginal),
    'Use spread operator or slice to copy before sorting'
);

// Test 18: Sort should return HIGH priority first (descending)
test(
    'sortByPriority should return highest priority first',
    'High',
    sorted[0].title,
    'Sort order: should high priority be at start or end?'
);

// ============================================================================
section('TEST 19-20: Tags');
// ============================================================================

const tm19 = new TaskManager();
const tagTask = tm19.createTask('Tag test');
tm19.addTag(tagTask.id, 'Important');
tm19.addTag(tagTask.id, 'IMPORTANT');  // Same tag, different case
tm19.addTag(tagTask.id, 'important');
test(
    'Should not allow duplicate tags (case-insensitive)',
    1,
    tm19.getTaskById(tagTask.id).tags.length,
    'Check for existing tags before adding'
);

// Test 20: removeTag should handle non-existent tag gracefully
const tm20 = new TaskManager();
const tagTask2 = tm20.createTask('Remove tag test', { tags: ['keep-me'] });
tm20.removeTag(tagTask2.id, 'non-existent-tag');
test(
    'Removing non-existent tag should not remove other tags',
    1,
    tm20.getTaskById(tagTask2.id).tags.length,
    'What does indexOf return for non-existent items? What does splice(-1, 1) do?'
);

// ═══════════════════════════════════════════════════════════════════════════
//                              FINAL SCORE
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(60));
console.log('                        FINAL RESULTS');
console.log('═'.repeat(60));
console.log(`
    ✅ Passed: ${passed}
    ❌ Failed: ${failed}
    
    Score: ${passed * 5}/100 points
`);

if (failed === 0) {
    console.log(`
    🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
    
         CONGRATULATIONS! ALL TESTS PASSED!
         
         You are a TRUE BUG HUNTER! 🏆
         
         Show this to your instructor to claim
         your prize!
         
    🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
    `);
} else {
    console.log(`
    Keep hunting! ${failed} bugs remaining...
    
    TIP: Use Copilot CLI:
    > copilot
    > @todo.js @test.js help me fix the failing tests
    `);
}

console.log('═'.repeat(60) + '\n');
