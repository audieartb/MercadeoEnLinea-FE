<template>
  <div>
    <md-table v-model="users" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Nombre">{{ item.firstName }}</md-table-cell>
        <md-table-cell md-label="Apellidos ">{{ item.lastName }}</md-table-cell>
        <md-table-cell md-label="Email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Teléfono">{{
          item.phoneNumber
        }}</md-table-cell>
        <md-table-cell md-label="Rol">{{ item.permissionLevel }}</md-table-cell>
        <md-table-cell md-label="Fecha de creación">{{
          item.dateCreated | dateFilter
        }}</md-table-cell>
        <md-table-cell md-label="Acciones">
          <EditModalUser
            :id="item.id"
            :firstName="item.firstName"
            :lastName="item.lastName"
            :phoneNumber="item.phoneNumber"
            :permissionLevel="item.permissionLevel"
            :email="item.email"
            :dateCreated="item.dateCreated"
          ></EditModalUser>
          <md-button
            class="md-just-icon md-simple md-danger"
            @click="(active = true), (value = item.id)"
          >
            <md-icon>close</md-icon>
            <md-tooltip md-direction="top">Eliminar</md-tooltip>
          </md-button>
          <md-button
            @click="resetPassword(item.id)"
            class="md-just-icon md-simple md-info"
          >
            <md-icon>autorenew</md-icon>
            <md-tooltip md-direction="top">Re-establecer contraseña</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-dialog-confirm
      :md-active.sync="active"
      md-title="¿Está seguro de que quiere eliminar el usuario?"
      md-confirm-text="Sí"
      md-cancel-text="No"
      @md-cancel="onCancelDelete"
      @md-confirm="onConfirmDelete"
    />
    <div>
      <AddUserModal v-on:modalToAdmin="addNewUser" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import UserService from "../../services/Users/users.service";
import AddUserModal from "../Useradmin/addUserModal.vue";
import EditModalUser from "../Useradmin/EditUserModal.vue";
export default {
  name: "admintab",
  components: {
    AddUserModal,
    EditModalUser,
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      active: false,
      value: null,
      selected: [],
      users: [],
    };
  },
  methods: {
    onConfirmDelete() {
      let res = UserService.deleteUsers(this.value)
        .then(() => {
          const removeIndex = this.users.findIndex(
            item => item.id === this.value,
          );
          this.users.splice(removeIndex, 1);
          this.value = null;
          this.$notify({
            message: "El usuario fue eliminado exitosamente",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "info",
          });
        })
        .catch(() => {
          this.$notify({
            message: "No se pudo eliminar el usuario",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger",
          });
        });

      return res;
    },
    onCancelDelete() {
      this.value = "Disagreed";
    },
    remove() {},
    addNewUser(data) {
      this.users.push(data);
    },
    async getUsers() {
      let data = await UserService.getAllUsers();
      this.users = data;
    },
    async resetPassword(userId) {
      await UserService.resetPassword(userId);
    },
  },
  created() {
    this.getUsers();
  },
  filters: {
    dateFilter(date) {
      return moment(date).format("MM-DD-YYYY");
    },
  },
};
</script>
