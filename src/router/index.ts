import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/home',
      component: () => import('../views/Home.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/water-quality',
      component: () => import('../views/WaterQuality.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/data-analysis',
      component: () => import('../views/DataAnalysis.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/alert',
      component: () => import('../views/Alert.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/geo-visualization',
      component: () => import('../views/GeoVisualization.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user-management',
      component: () => import('../views/UserManagement.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLogin) {
    next('/login')
  } else {
    next()
  }
})

export default router
