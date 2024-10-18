import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        // Here, IndexPage is the default component for the root path
      },
      {
        path: 'task/:id', // This is the path for the task modal
        props: true, // Pass route params as props to the component
        name: 'TaskModal', // Named route for easier navigation
        component: () => import('components/TaskModal.vue'), // Load the modal component
      },
    ],
  },
  // {
  //   path: '/task/:id',
  //   props: true,
  //   name: 'TaskModal',
  //   component: () => import('components/TaskModal.vue'),
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
