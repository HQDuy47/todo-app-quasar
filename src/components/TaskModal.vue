<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">x </span>
      <p class="header">Update</p>
      <input class="input-class" v-model="newTitle" type="text" />
      <div class="footer">
        <button class="save-button" @click="saveTask">save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTaskStore } from '../stores/TaskStore';
import type { Task } from '../interfaces/Task';

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const isVisible = ref(true);
const task = ref<Task | null>(null);
const newTitle = ref('');

onMounted(async () => {
  const id = Number(route.params.id);
  task.value = await taskStore.getTaskById(id);

  if (task.value) {
    newTitle.value = (task.value as Task).title;
  }
});

const saveTask = async () => {
  if (task.value) {
    try {
      await taskStore.updateTaskTitleById(task.value.id, newTitle.value);
      closeModal();
    } catch (error) {
      console.error('Could not update task', error);
    }
  }
};

const closeModal = () => {
  isVisible.value = false;
  router.back();
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 500px;
  max-width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  transform: scale(0.9);
  animation: modalFadeIn 0.4s forwards;
  box-sizing: border-box;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  font-size: 24px;
  color: #333;
  transition: color 0.2s ease;
}

.close:hover {
  color: #e74c3c;
}

.header {
  font-size: 24px;
  font-weight: bold;
  text-align: start;
  color: #333;
  margin-bottom: 20px;
}

.footer {
  display: flex;
  justify-content: flex-end;
}

button {
  padding: 10px 20px;
  background-color: #ffd859;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  width: 30%;
}

button:hover {
  background-color: #efcb54;
}

p {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.input-class {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.input-class:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0px 0px 8px rgba(0, 123, 255, 0.2);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
