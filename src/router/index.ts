import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ContentView from "@/views/ContentView.vue";
import SearchView from "@/views/SearchView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/HomeView.vue'),
    meta: {
        title: 'Home',
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: {
        title: 'About',
    }
  },
  {
    path: '/wiki/:location([^?#]*)',
    name: 'content',
    component: ContentView,
    props: true,
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: {
        title: 'Search',
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
