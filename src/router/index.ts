import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import MyPostsView from '../views/MyPostsView.vue'
import NotificationsView from '../views/NotificationsView.vue'
import SettingsView from '../views/SettingsView.vue'
import AboutView from '../views/AboutView.vue'
import AuthView from '../views/AuthView.vue'

// Clientseitige Routen fuer die Single-Page-App
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/beitraege', name: 'posts', component: HomeView, meta: { scrollTo: 'beitraege' } },
    { path: '/info', name: 'info', component: HomeView, meta: { scrollTo: 'info' } },
    { path: '/profil', name: 'profile', component: ProfileView },
    { path: '/anmelden', name: 'login', component: AuthView, props: { mode: 'login' } },
    { path: '/registrieren', name: 'register', component: AuthView, props: { mode: 'register' } },
    { path: '/meine-beitraege', name: 'my-posts', component: MyPostsView },
    { path: '/benachrichtigungen', name: 'notifications', component: NotificationsView },
    { path: '/einstellungen', name: 'settings', component: SettingsView },
    { path: '/ueber', name: 'about', component: AboutView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to) {
    if (typeof to.meta.scrollTo === 'string') {
      return {
        el: `#${to.meta.scrollTo}`,
        top: 16,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },
})

export default router
