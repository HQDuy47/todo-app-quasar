<template>
  <main>
    <!-- heading -->
    <header>
      <img src="src/assets/horse-logo.svg" alt="horse logo" />
      <h1>Task Management</h1>
    </header>

    <!-- new task form -->
    <div class="new-task-form">
      <TaskForm />
    </div>

    <!-- filter -->
    <nav class="filter">
      <button @click="filter = 'all'">All tasks</button>
      <button @click="filter = 'favs'">Fav tasks</button>
    </nav>

    <div class="task-list" v-if="filter === 'all'">
      <p>
        You have
        <span class="hightlight"> {{ totalTasks }} </span> tasks left to do
      </p>
      <transition name="switch" mode="out-in">
        <transition-group name="list">
          <div v-for="task in tasks.slice().reverse()" :key="task.id">
            <TaskDetail :task="task" />
          </div>
        </transition-group>
      </transition>
    </div>
    <div class="task-list" v-if="filter === 'favs'">
      <p>
        You have
        <span class="hightlight"> {{ favTasksCount }} </span> favs left to do
      </p>
      <transition name="switch" mode="out-in">
        <transition-group name="list">
          <div v-for="task in favTasks.slice().reverse()" :key="task.id">
            <TaskDetail :task="task" />
          </div>
        </transition-group>
      </transition>
    </div>
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '../stores/TaskStore';
import { storeToRefs } from 'pinia';
import TaskForm from 'src/components/TaskForm.vue';
import TaskDetail from '../components/TaskDetail.vue';

const taskStore = useTaskStore();
const { tasks, totalTasks, favTasksCount, favTasks } = storeToRefs(taskStore);
const filter = ref('all');

taskStore.getTasks();

defineOptions({
  name: 'IndexPage',
});
</script>
