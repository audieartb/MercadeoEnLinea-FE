<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/notifications">
        <md-icon>notifications_none</md-icon>
        <p>Notificación</p>
      </sidebar-link>
      <sidebar-link to="/dashboard">
        <md-icon>data_saver_off</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/projects-list">
        <md-icon>work_outline</md-icon>
        <p>Proyectos</p>
      </sidebar-link>
      <sidebar-link to="/calendar">
        <md-icon>event</md-icon>
        <p>Calendario</p>
      </sidebar-link>
      <sidebar-link to="/user">
        <md-icon>person</md-icon>
        <p>Perfil</p>
      </sidebar-link>
      <sidebar-link to="/admin-user">
        <md-icon>person_add</md-icon>
        <p>Usuarios</p>
      </sidebar-link>
      <sidebar-link to="/table">
        <md-icon>history_edu</md-icon>
        <p>Bitácora</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";
export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu,
  },
  data() {
    return {
      sidebarBackground: "blue",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
    };
  },
};
</script>