import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import DashboardMe from "@/pages/DashboardMe.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Password from "@/pages/Password.vue";
import Projects from "@/pages/Projects.vue";
import Project from "@/pages/Projects.vue";
import AddProject from "@/pages/AddProject.vue";
import Login from "@/pages/Login.vue";
import Notifications from "@/pages/Notifications.vue";
import NotificationsMe from "@/pages/NotificationsMe.vue";
import AdminUser from "@/pages/AdminUser.vue";
import CalendarMe from "@/pages/CalendarMe.vue";
import ProjectsMe from "@/pages/ProjectsMe.vue";
import Vue from "vue";
import VueRouter from "vue-router"

import store from "../store"

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: "/password",
      component: Password
    },
    {
      path: "/login",

      component: Login
    },
    {
      path: "/",
      component: DashboardLayout,
      redirect: "/login",
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: DashboardMe,
          meta: { requiresAuth: true }
        },
        {
          path: "user",
          name: "Perfil",
          component: UserProfile,
          meta: { requiresAuth: true }
        },
        {
          path: "table",
          name: "Bitácora",
          component: TableList,
          meta: { requiresAuth: true }
        },
        {
          path: "projects",
          name: "Projects",
          component: Projects,
          meta: { requiresAuth: true }
        },
        {
          path: "add-project",
          name: "Crear proyecto",
          component: AddProject,
          meta: { requiresAuth: true }
        },
        {
          path: "edit-project/:projectId",
          name: "Editar proyecto",
          component: AddProject,
          meta: { requiresAuth: false }
        },
        {
          path: "notifications",
          name: "Notificaciones",
          component: NotificationsMe,
          meta: { requiresAuth: true }
        },
        {
          path: "notificationsme",
          name: "Notifications",
          component: NotificationsMe,
          meta: { requiresAuth: true }
        },
        {
          path: "admin-user",
          name: "Administracion de Usuarios",
          component: AdminUser,
          meta: { requiresAuth: true }
        },
        {
          path: "calendar",
          name: "Calendario",
          component: CalendarMe,
          meta: { requiresAuth: true }
        },
        {
          path: "calendar/:openEventId",
          name: "Calendario",
          component: CalendarMe,
          props: true,
          meta: { requiresAuth: true }
        },
        {
          path: "projects-list",
          name: "Proyectos",
          component: ProjectsMe,
          meta: { requiresAuth: true }
        },
        {
          path: "project/:id",
          name: "Proyecto",
          component: Project,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // const rutaProtegida = to.matched.some(record => record.meta.requiresAuth)
  // if (rutaProtegida && store.state.token === '') {
  //   next({
  //     path: "/login",
  //   });
  // } else {
  //   next();
  // }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
});

export default router;
