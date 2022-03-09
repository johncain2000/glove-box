import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Chart from '../views/Chart.vue'
import EventService from "@/services/EventService.js";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {requiresLogin: true}
  },
  {
    path: '/chart',
    name: 'Chart',
    component: Chart,
    meta: {requiresLogin: true}
  }
]

const router = new VueRouter({
  mode: "history",
  routes,
})

router.beforeEach(async (to, from, next) => {
    const routeExists = routes.find(r => r.path === to.path);
    const requiresLogin = to.matched.some(record => record.meta.requiresLogin);

    if (requiresLogin) {
      try {
        await EventService.checkToken();
        next();
      } catch (e) {
        next('/login');
      }
    } else if (routeExists) {
      next();
    } else {
      next('/');
    }
})

export default router
