import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UnitView from '../views/UnitView.vue'
import PosView from '../views/PosView.vue'
import ItemView from '../views/ItemView.vue'
import ReceiptView from '../views/ReceiptView.vue'
// import ReceiptDetailView from '../views/ReceiptDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/receipt/:receiptId',
      name: 'receiptDetail',
      component: () => import('../views/ReceiptDetailView.vue')
    },
    {
      path: '/receipt',
      name: 'receipt',
      component: ReceiptView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
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

    // {
    //   path: '/receiptDetail/:receiptId',
    //   name: 'receiptDetail',
    //   component: ReceiptDetailView
    // },
    {
      path: '/pos',
      name: 'pos',
      component: PosView
    }
  ]
})

export default router
