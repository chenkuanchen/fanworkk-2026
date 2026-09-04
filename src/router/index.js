import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import InfoView from '@/views/InfoView.vue'
import ProjectView from '@/views/ProjectView.vue'
import WorksView from '@/views/WorksView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/works', name: 'works', component: WorksView },
    { path: '/project/:id', name: 'project', component: ProjectView },
    { path: '/info', name: 'info', component: InfoView },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
