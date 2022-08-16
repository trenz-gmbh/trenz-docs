import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import ContentView from "@/views/ContentView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

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
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + ' \u2022 ' + process.env.VUE_APP_NAME;
    } else if (to.params.location) {
        document.title = (to.params.location as string).split('/').pop() + ' \u2022 ' + process.env.VUE_APP_NAME;
    } else {
        document.title = process.env.VUE_APP_NAME;
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
