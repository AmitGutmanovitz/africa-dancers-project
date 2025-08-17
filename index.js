import { createRouter, createWebHistory } from 'vue-router'
import OrdersList from '@/assets/componnets/orders/ordersList.vue';
import Login from '@/assets/componnets/auth/login.vue';
import Register from '@/assets/componnets/auth/Register.vue';
import NewOrder from '@/assets/componnets/orders/NewOrder.vue';
import Logout from '@/assets/componnets/auth/logout.vue';
import About from '@/assets/componnets/com/about.vue';
import cancel from '@/assets/componnets/orders/cancel.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/orders/list',
      name: 'orders',
      component: OrdersList,
    },
    {
      path: '/login',
      name: 'login',
      component: Login, 
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/orders/add',
      name: 'newOrder',
      component: NewOrder,
    },
    {
      path: '/orders/add/:id',
      name: 'newOrderWithId',
      component: NewOrder,
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
    },{
      path: '/orders/edit/:orderID',
        name: 'editOrder',
        component: () => import('@/assets/componnets/orders/Edit.vue'),
        props: true, 
    },
    {
      path: '/',
      component: () => import('@/assets/componnets/com/HomePage.vue'),
    },{
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/assets/componnets/com/404.vue'),
    },{
      path: '/about',
      name: About,
      component: () => import('@/assets/componnets/com/about.vue')
    },{
      path: '/payment/:orderId',
      name: 'payment',
      component: () => import('@/assets/componnets/orders/payment.vue')
    },{
      path: '/orders/cart',
      name: 'cart',
      component: () => import('@/assets/componnets/orders/cart.vue')
    },{
      path: '/orders/cancel',
      name: 'cancel',
      component: cancel
    },
    {
      path: '/orders/confirm/:order_id',
      name: "confirm",
      component: () => import('@/assets/componnets/orders/confirm.vue'),
      //props: true
    }
     
  ]
})

export default router
