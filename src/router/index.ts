import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/UserManagement.vue')
    },
    {
      path: '/posts',
      name: 'Posts',
      component: () => import('../views/PostManagement.vue')
    },
    {
      path: '/comments',
      name: 'Comments',
      component: () => import('../views/CommentManagement.vue')
    },
    {
      path: '/wordbooks',
      name: 'Wordbooks',
      component: () => import('../views/WordbookManagement.vue')
    }
  ],
})

export default router
