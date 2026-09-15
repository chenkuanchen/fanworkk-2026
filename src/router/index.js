import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/works',
      name: 'works',
      component: () => import('@/views/WorksView.vue'),
    },
    {
      path: '/project/:id',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('@/views/InfoView.vue'),
    },
  ],
  scrollBehavior(to, from) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    // 從專案頁返回作品列表時，交由 WorksView 還原位置
    if (to.name === 'works' && from.name === 'project') {
      return false
    }
    return { top: 0 }
  },
})

export default router
