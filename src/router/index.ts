import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import ContentView from "@/views/ContentView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
    meta: {
        title: 'Home',
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
    component: () => import(/* webpackChunkName: "search" */ '../views/SearchView.vue'),
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
