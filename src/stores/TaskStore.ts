import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import {
  GET_TASKS,
  GET_TASK_BY_ID,
  DELETE_TASK_BY_ID,
  ADD_TASK,
  TOGGLE_FAV_TASK,
  UPDATE_TITLE_BY_ID,
} from '../graphql/task';
import { ApolloError } from '@apollo/client';
import { Task } from '../interfaces/Task';

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref<{ id: number; title: string; isFav: boolean }[]>([]);
  const error = ref<ApolloError | null>(null);

  // getters
  const favTasks = computed(() => {
    return tasks.value.filter((task) => task.isFav);
  });

  const favTasksCount = computed(() => {
    return tasks.value.filter((task) => task.isFav).length;
  });

  const totalTasks = computed(() => {
    return tasks.value.length;
  });

  // actions
  const getTasks = async () => {
    try {
      const { onResult, onError } = useQuery(GET_TASKS);
      onResult((result) => {
        tasks.value = result?.data?.Task || [];
      });
      onError((err) => {
        error.value = err as ApolloError;
      });
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const getTaskById = async (id: number): Promise<Task | null> => {
    try {
      const { onResult, onError } = useQuery(GET_TASK_BY_ID, { id });
      onResult((result) => {
        const task = result?.data?.Task_by_pk;
        if (task) {
          const existingTaskIndex = tasks.value.findIndex((t) => t.id === id);
          if (existingTaskIndex !== -1) {
            tasks.value[existingTaskIndex] = task;
          } else {
            tasks.value.push(task);
          }
        }
      });
      onError((err) => {
        error.value = err as ApolloError;
      });
    } catch (err) {
      console.error('Error fetching task by ID:', err);
      error.value = err as ApolloError;
      return null;
    }
    return tasks.value.find((task) => task.id === id) || null;
  };

  const updateTaskTitleById = async (id: number, title: string) => {
    if (!id || !title) {
      console.error('Invalid task ID or title:', id, title);
      return;
    }

    const { mutate } = useMutation(UPDATE_TITLE_BY_ID);
    try {
      const result = await mutate({ id, title });

      if (result?.data?.update_Task?.affected_rows) {
        const updatedTask = result.data.update_Task.returning[0];
        tasks.value = tasks.value.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const deleteTaskById = async (id: number) => {
    if (!id) {
      console.error('Invalid task ID:', id);
      return;
    }

    const { mutate } = useMutation(DELETE_TASK_BY_ID);

    try {
      const result = await mutate({ id });

      if (result?.data?.delete_Task_by_pk) {
        tasks.value = tasks.value.filter((task) => task.id !== id);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      error.value = err as ApolloError;
    }
  };

  const addTask = async ({
    title,
    isFav,
  }: {
    title: string;
    isFav: boolean;
  }) => {
    const { mutate } = useMutation(ADD_TASK);

    try {
      const result = await mutate({ title, isFav });

      if (result?.data?.insert_Task?.returning) {
        const newTasks = [...tasks.value, ...result.data.insert_Task.returning];
        tasks.value = newTasks;
      }
    } catch (err) {
      console.error('Error adding task:', err);
      error.value = err as ApolloError;
    }
  };

  const toggleTaskFav = async (id: number, currentFav: boolean) => {
    const newFavValue = !currentFav; // Toggle the current value
    const { mutate } = useMutation(TOGGLE_FAV_TASK);

    try {
      const result = await mutate({ id, isFav: newFavValue });

      if (result?.data?.update_Task?.affected_rows) {
        const updatedTask = result.data.update_Task.returning[0];
        tasks.value = tasks.value.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      }
    } catch (err) {
      console.error('Error updating task:', err);
      error.value = err as ApolloError;
    }
  };

  return {
    tasks,
    favTasks,
    favTasksCount,
    totalTasks,
    getTasks,
    getTaskById,
    deleteTaskById,
    addTask,
    toggleTaskFav,
    updateTaskTitleById,
  };
});
