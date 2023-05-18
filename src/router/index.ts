import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UnitView from '../views/UnitView.vue'
import PosView from '../views/PosView.vue'
import ItemView from '../views/ItemView.vue'
import ReceiptView from '../views/ReceiptView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/unit',
      name: 'unit',
      component: UnitView
    },
    {
      path: '/item',
      name: 'item',
      component: ItemView
    },
    {
      path: '/receipt',
      name: 'receipt',
      component: ReceiptView
    },
    {
      path: '/pos',
      name: 'pos',
      component: PosView
    }
  ]
})

export default router
