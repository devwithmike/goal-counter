// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: { template: '<div></div>' } }, // dummy route
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
