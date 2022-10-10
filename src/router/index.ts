import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'About'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Change document titles
router.beforeEach((to, _from, next) => {
  document.title = `Virtual File System | ${to.meta.title}`
  next()
})
export default router
