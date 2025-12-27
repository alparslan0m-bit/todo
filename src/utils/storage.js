/**
 * LocalStorage persistence utilities for tasks and intentions
 * Handles all data storage and retrieval operations
 */

const TASKS_KEY = 'tododo_tasks';
const INTENTIONS_KEY = 'tododo_intentions';

// Default intentions in Arabic
const DEFAULT_INTENTIONS = [
  'رضا الله',
  'طلب العلم',
  'مساعدة الآخرين'
];

/**
 * Initializes LocalStorage with default values if empty
 */
export const initializeStorage = () => {
  // Initialize tasks if not present
  if (!localStorage.getItem(TASKS_KEY)) {
    localStorage.setItem(TASKS_KEY, JSON.stringify([]));
  }

  // Initialize intentions with defaults if not present
  if (!localStorage.getItem(INTENTIONS_KEY)) {
    localStorage.setItem(INTENTIONS_KEY, JSON.stringify(DEFAULT_INTENTIONS));
  }
};

/**
 * Retrieves all tasks from LocalStorage
 * @returns {Array} Array of task objects
 */
export const getTasks = () => {
  try {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    return [];
  }
};

/**
 * Saves a new task to LocalStorage
 * @param {Object} task - Task object with title, category, intention, completed status
 * @returns {Object} The saved task with ID
 */
export const addTask = (task) => {
  try {
    const tasks = getTasks();
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      category: task.category,
      intention: task.intention,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
};

/**
 * Updates a task's completion status
 * @param {string} taskId - ID of the task to update
 * @param {boolean} completed - New completion status
 * @returns {Object|null} Updated task or null if not found
 */
export const updateTaskStatus = (taskId, completed) => {
  try {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = completed;
      tasks[taskIndex].completedAt = completed ? new Date().toISOString() : null;
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      return tasks[taskIndex];
    }
    return null;
  } catch (error) {
    console.error('Error updating task status:', error);
    return null;
  }
};

/**
 * Deletes a task from LocalStorage
 * @param {string} taskId - ID of the task to delete
 * @returns {boolean} True if task was deleted
 */
export const deleteTask = (taskId) => {
  try {
    const tasks = getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

/**
 * Retrieves all intentions from LocalStorage
 * @returns {Array} Array of intention strings
 */
export const getIntentions = () => {
  try {
    const intentions = localStorage.getItem(INTENTIONS_KEY);
    return intentions ? JSON.parse(intentions) : DEFAULT_INTENTIONS;
  } catch (error) {
    console.error('Error retrieving intentions:', error);
    return DEFAULT_INTENTIONS;
  }
};

/**
 * Adds a new intention to LocalStorage
 * @param {string} intention - New intention text
 * @returns {boolean} True if intention was added
 */
export const addIntention = (intention) => {
  try {
    if (!intention || intention.trim() === '') {
      return false;
    }
    const intentions = getIntentions();
    if (!intentions.includes(intention)) {
      intentions.push(intention);
      localStorage.setItem(INTENTIONS_KEY, JSON.stringify(intentions));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding intention:', error);
    return false;
  }
};

/**
 * Deletes an intention from LocalStorage
 * @param {string} intention - Intention to delete
 * @returns {boolean} True if intention was deleted
 */
export const deleteIntention = (intention) => {
  try {
    if (DEFAULT_INTENTIONS.includes(intention)) {
      return false; // Don't delete default intentions
    }
    const intentions = getIntentions();
    const filteredIntentions = intentions.filter(i => i !== intention);
    localStorage.setItem(INTENTIONS_KEY, JSON.stringify(filteredIntentions));
    return true;
  } catch (error) {
    console.error('Error deleting intention:', error);
    return false;
  }
};



/**
 * Clears all data from LocalStorage (destructive operation)
 * @returns {boolean} True if data was cleared
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(INTENTIONS_KEY);
    initializeStorage();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
