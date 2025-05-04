import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView.vue";
import TmpView from "@/views/TmpView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminPanel.vue'),
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/admin/DashboardView.vue')
      },
      {
        path: 'venues',
        name: 'venues',
        component: () => import('../views/admin/VenuesView.vue')
      },
      {
        path: 'announcements',
        name: 'announcements',
        component: () => import('../views/admin/AnnouncementsView.vue')
      },
      {
        path: 'trainers',
        name: 'trainers',
        component: () => import('../views/admin/TrainersView.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/admin/OrdersView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
