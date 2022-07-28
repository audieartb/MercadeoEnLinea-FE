<template>
  <div>
    <md-table v-model="notifications" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Fecha">{{ item.datetime }}</md-table-cell>
        <md-table-cell md-label="Titulo">{{ item.title }}</md-table-cell>
        <md-table-cell md-label="Mensaje">{{ item.message }}</md-table-cell>
        <md-table-cell md-label="Acciones">
          <small>
            <md-button class="md-just-icon md-simple md-info"  @click="notify()">
              <md-icon>visibility</md-icon>
              <md-tooltip md-direction="top">Ver</md-tooltip>
            </md-button>

            <md-button class="md-just-icon md-simple md-info" to="/project">
              <md-icon>edit</md-icon>
              <md-tooltip md-direction="top" >Editar</md-tooltip>
            </md-button>
          </small>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import NotificationService from "../../services/notifications.service";
export default {
  data() {
    return {
      notifications: [
        {
          datetime: "05/02/2021",
          title: "new task",
          message: "new task on project",
          status: false,
        },
        {
          datetime: "05/02/2021",
          title: "new task",
          message: "new task on project",
          status: false,
        },
        {
          datetime: "05/02/2021",
          title: "new task",
          message: "new task on project",
          status: false,
        },
        {
          datetime: "05/02/2021",
          title: "new task",
          message: "new task on project",
          status: false,
        },
        {
          datetime: "05/02/2021",
          title: "new task",
          message: "new task on project",
          status: false,
        },
      ],
      notificationsArr: {},
      type: "success"
    };
  },
  methods: {
    async getNotifications() {
      this.notificationsArr = await NotificationService.getNotifications(1);
    },
    notify() {
      this.$notify({
        message: "test message",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: this.type,
      });
    },
  },
  mounted() {
    this.getNotifications();
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  }
};
</script>

<style lang="scss" scoped>
</style>