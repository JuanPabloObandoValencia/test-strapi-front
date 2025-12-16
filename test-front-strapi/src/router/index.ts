import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ProfileView from '@/views/ProfileView.vue';
import { isAuthenticated } from '../services/strapiService';

// Define custom meta fields for type safety
declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean;
        requiresGuest?: boolean;
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { requiresGuest: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ProfileView,
        meta: { requiresAuth: true }
    },
    {
        path: '/posts/create',
        name: 'CreatePost',
        component: () => import('@/views/CreatePostView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/posts',
        name: 'Posts',
        component: () => import('../views/PostsView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/docs',
        name: 'DocsList',
        component: () => import('../views/docs/DocsListView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/docs/:slug',
        name: 'DocDetail',
        component: () => import('../views/docs/DocDetailView.vue'),
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation guards
router.beforeEach((to, _from, next) => {
    const userIsAuthenticated = isAuthenticated();

    // Redirect to dashboard if authenticated user tries to access login
    if (to.meta.requiresGuest && userIsAuthenticated) {
        next('/dashboard');
    }
    // Redirect to login if unauthenticated user tries to access protected route
    else if (to.meta.requiresAuth && !userIsAuthenticated) {
        next('/login');
    }
    // Allow navigation
    else {
        next();
    }
});

export default router;
