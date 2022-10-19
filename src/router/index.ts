import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import ContentView from "@/views/ContentView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import store from "@/store";

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
    {
        path: '/:path(.*)*',
        component: NotFoundView,
        meta: {
            title: 'Not Found',
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const appName = store.state.settings?.name ?? 'Loading...'
    if (to.meta.title) {
        document.title = to.meta.title + ' \u2022 ' + appName;
    } else if (to.params.location) {
        document.title = (to.params.location as string).split('/').pop() + ' \u2022 ' + appName;
    } else {
        document.title = appName;
    }

    if (Object.hasOwnProperty.call(to.query, 'error')) {
        switch (to.query.error) {
            case 'login_not_available':
                alert("Sign in is currently not available. Please try again later.");
                break;
            default:
                break;
        }
    }

    next()
});

export default router
