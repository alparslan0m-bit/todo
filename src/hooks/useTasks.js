/**
 * Custom hook for managing tasks with real-time updates
 * Synchronizes with LocalStorage and triggers re-renders when data changes
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getTasks,
  addTask as addTaskToStorage,
  updateTaskStatus as updateTaskStatusInStorage,
  deleteTask as deleteTaskFromStorage
} from '../utils/storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from storage on component mount
  useEffect(() => {
    const loadTasks = () => {
      const storedTasks = getTasks();
      setTasks(storedTasks);
      setLoading(false);
    };
    loadTasks();
  }, []);

  // Add a new task
  const addTask = useCallback((task) => {
    const newTask = addTaskToStorage(task);
    if (newTask) {
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    }
    return null;
  }, []);

  // Update task completion status
  const updateTaskStatus = useCallback((taskId, completed) => {
    const updatedTask = updateTaskStatusInStorage(taskId, completed);
    if (updatedTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
      return updatedTask;
    }
    return null;
  }, []);

  // Delete a task
  const deleteTask = useCallback((taskId) => {
    const success = deleteTaskFromStorage(taskId);
    if (success) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
    return success;
  }, []);

  // Get tasks filtered by category
  const getTasksByCategory = useCallback((category) => {
    return tasks.filter(task => task.category === category);
  }, [tasks]);

  // Get today's tasks
  const getTodaysTasks = useCallback(() => {
    const today = new Date().toDateString();
    return tasks.filter(task => {
      const createdDate = new Date(task.createdAt).toDateString();
      return createdDate === today;
    });
  }, [tasks]);

  // Get incomplete tasks
  const getIncompleteTasks = useCallback(() => {
    return tasks.filter(task => !task.completed);
  }, [tasks]);

  // Get completed tasks
  const getCompletedTasks = useCallback(() => {
    return tasks.filter(task => task.completed);
  }, [tasks]);

  return {
    tasks,
    loading,
    addTask,
    updateTaskStatus,
    deleteTask,
    getTasksByCategory,
    getTodaysTasks,
    getIncompleteTasks,
    getCompletedTasks
  };
};
