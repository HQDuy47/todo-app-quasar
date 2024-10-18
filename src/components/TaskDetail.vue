<template>
  <div class="task">
    <h6>{{ task.title }}</h6>

    <div class="icons">
      <i class="material-icons" @click="taskStore.deleteTaskById(task.id)"
        >delete</i
      >
      <i
        class="material-icons"
        :class="{ active: task.isFav }"
        @click="taskStore.toggleTaskFav(task.id, task.isFav)"
        >favorite</i
      >
      <i class="material-icons" @click="openModal">info</i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useTaskStore } from '../stores/TaskStore';
import { useRouter } from 'vue-router';

const taskStore = useTaskStore();
const router = useRouter();

const props = defineProps<{
  task: {
    id: number;
    title: string;
    isFav: boolean;
  };
}>();

const openModal = () => {
  router.push({ name: 'TaskModal', params: { id: props.task.id } });
};
</script>

<style scoped></style>
