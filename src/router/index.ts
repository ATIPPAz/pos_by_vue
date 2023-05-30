import { createRouter, createWebHistory } from 'vue-router'
const HomeView = () => import('@/views/HomeView.vue')
const UnitView = () => import('@/views/UnitView.vue')
const PosView = () => import('@/views/PosView.vue')
const ItemView = () => import('@/views/ItemView.vue')
const ReceiptView = () => import('@/views/ReceiptView.vue')
const ReceiptDetailView = () => import('@/views/ReceiptDetailView.vue')
// const MainLayout = () => import('@/components/layout/MainLayout.vue')
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '',
      // component: MainLayout,
      children: [
        {
          path: '/receipt/:receiptId',
          name: 'receiptDetail',
          component: ReceiptDetailView
        },
        {
          path: '/receipt',
          name: 'receipt',
          component: ReceiptView
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
          path: '/pos',
          name: 'pos',
          component: PosView
        }
      ]
    }
  ]
})

export default router
