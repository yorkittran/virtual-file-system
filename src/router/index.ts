import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import UserManual from '@/views/UserManual.vue'

import { useUserStore } from '@/stores/user'
import { useHelper } from '@/composables/useHelper'

const helper = useHelper()

export const ROUTES = {
  LOGIN: {
    path: '/login',
    name: 'login',
    title: 'Login'
  },
  HOME: {
    path: '/',
    name: 'home',
    title: 'Home'
  },
  USER_MANUAL: {
    path: '/user_manual',
    name: 'user_manual',
    title: 'User Manual'
  }
}

const routes = [
  {
    path: ROUTES.LOGIN.path,
    name: ROUTES.LOGIN.name,
    component: Login,
    meta: {
      title: ROUTES.LOGIN.title,
      requireAuth: false
    }
  },
  {
    path: ROUTES.HOME.path,
    name: ROUTES.HOME.name,
    component: Home,
    meta: {
      title: ROUTES.HOME.title,
      requireAuth: true
    }
  },
  {
    path: ROUTES.USER_MANUAL.path,
    name: ROUTES.USER_MANUAL.name,
    component: UserManual,
    meta: {
      title: ROUTES.USER_MANUAL.title,
      requireAuth: true
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

// Route guard for auth routes
router.beforeEach(async (to, _from, next) => {
  if (to.meta.requireAuth) {
    const hasUser = helper.hasUser()
    const userStore = useUserStore()
    if (hasUser && userStore.user) {
      next()
      return
    } else if (hasUser && !userStore.user) {
      const errors = await userStore.getMe()
      if (errors?.length) {
        helper.removeUserToken()
        next({ name: ROUTES.LOGIN.name })
        return
      }
      next()
      return
    } else {
      next({ name: ROUTES.LOGIN.name })
      return
    }
  }
  next()
})
export default router
