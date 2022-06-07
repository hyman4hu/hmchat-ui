import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from "@/views/Layout";

const routes = [
  {
    path: '/',
    name: '首页',
    redirect: "/home",
    component: Layout,
    children: [
      { path: '/home', component: () => import("@/views/Home"), name: '聊天' },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
