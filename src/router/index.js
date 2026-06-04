import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/features/landing/views/LandingView.vue'),
    },
    {
      path: '/box-roulette',
      name: 'box-roulette',
      component: () => import('@/features/boxRoulette/views/BoxRouletteView.vue'),
    },
    {
      path: '/test-page',
      name: 'test-page',
      component: () => import('@/features/test-page/views/TestPageView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/shared/components/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
