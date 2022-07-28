<template>
  <div class="content">
    <form>
      <md-card>
        <md-card-header data-background-color="blue">
          <h4 class="title">Crear Proyecto</h4>
        </md-card-header>

        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field>
                <label>Nombre del Proyecto</label>
                <md-input
                  v-model="projectData.projectName"
                  type="text"
                ></md-input>
              </md-field>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-50">
                <md-datepicker
                  name="start"
                  id="start"
                  v-model="projectData.startDate"
                  :disabled="sending"
                  md-immediately
                ></md-datepicker>
              </div>
              <div class="md-layout-item md-size-50">
                <md-datepicker
                  name="end"
                  id="end"
                  v-model="projectData.endDate"
                  :disabled="sending"
                  md-immediately
                >
                </md-datepicker>
              </div>
            </div>
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Descripción</label>
                <md-input
                  v-model="projectData.description"
                  type="text"
                ></md-input>
              </md-field>
            </div>

            <div class="md-layout-item md-size-100">
              <!-- <md-table v-model="users" md-card @md-selected="onSelect" :md-selected-value.sync="selectedUsers"> -->
              <md-table
                v-model="users"
                md-card
                :md-selected-value.sync="selectedUsers"
              >
                <md-table-toolbar>
                  <h5>Selecciona los usuarios para este proyecto</h5>
                </md-table-toolbar>
                <md-table-toolbar
                  slot="md-table-alternate-header"
                  slot-scope="{ count }"
                >
                  <div class="md-toolbar-section-start">
                    {{ getAlternateLabel(count) }}
                  </div>
                  <div class="md-toolbar-section-end">
                    <md-button class="md-icon-button">
                      <md-icon>delete</md-icon>
                    </md-button>
                  </div>
                </md-table-toolbar>
                <md-table-row
                  slot="md-table-row"
                  slot-scope="{ item }"
                  md-selectable="multiple"
                  md-auto-select
                >
                  <md-table-cell md-label="Nombre" md-sort-by="Nombre">{{
                    item.firstName
                  }}</md-table-cell>
                  <md-table-cell md-label="Apellido" md-sort-by="Apellido">{{
                    item.lastName
                  }}</md-table-cell>
                  <md-table-cell md-label="Correo" md-sort-by="Correo">{{
                    item.email
                  }}</md-table-cell>
                  <md-table-cell md-label="Nivel" md-sort-by="Nivel">{{
                    item.permissionLevel
                  }}</md-table-cell>
                </md-table-row>
              </md-table>
            </div>
            <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-raised md-info" v-on:click="createProject">{{
                btnMessage
              }}</md-button>
              <md-button class="md-raised md-danger" @click="cancelUpdate"
                >Cancelar</md-button
              >
            </div>
          </div>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import projectService from "../services/Projects/projects.service";
import userService from "../services/Users/users.service";
import moment from "moment";
export default {
  data() {
    return {
      users: [],
      selectedUsers: [],
      projectData: {
        owner: null,
        description: null,
        projectName: null,
        startDate: null,
        endDate: null,
        members: [],
      },
      projectname: null,
      pm: null,
      teammember: null,
      team: null,
      projectId: null,
      sending: false,
      update: false,
      btnMessage: "Crear Proyecto",
    };
  },
  created() {
    if (this.$route.params.projectId) {
      this.update = true;
      this.projectId = this.$route.params.projectId;
    }
    this.setupUpdate();
  },
  methods: {
    onSelect(items) {
      this.projectData.members = items;
    },
    getAlternateLabel(count) {
      let plural = "";
      if (count > 1) {
        plural = "s";
      }
      return `${count} usuario${plural} seleccionados`;
    },
    async createProject() {
      this.projectData.owner = this.userDB.userId;

      if (!this.update) {
        await projectService.create(this.projectData).then(response => {
          this.$router.push(`/project/${response.id}`);
          this.$notify({
            message: "El proyecto fue creado exitosamente",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "info",
          });
        });
      } else {
        this.projectData.members = this.selectedUsers;
        this.projectData.projectId = this.projectId;
        await projectService.update(this.projectData).then(() => {
          this.$router.push(`/projects-list`);
          this.$notify({
            message: "El proyecto fue editado exitosamente",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "info",
          });
        });
      }
    },
    async getUsers() {
      try {
        this.users = await userService.getAllUsers();

        this.users.forEach((user, index) => {
          if (user.id == this.userDB.userId) {
            this.users.splice(index,1)
            return;
          }
          if (this.projectData.members.includes(user.id)) {
            this.selectedUsers.push(user);
          }
        });

        return;
      } catch (error) {
        alert(error);
      }
    },
    async getProjectDetails() {
      try {
        let id = this.$route.params.projectId;

        if (id) {
          let temp = await projectService.getById(id).then(response => {
            return response.data;
          });

          this.update = true;
          this.projectData.projectName = temp.projectName;
          this.projectData.startDate = moment(temp.startDate).format(
            "YYYY-MM-DD",
          );
          this.projectData.endDate = moment(temp.endDate).format("YYYY-MM-DD");
          this.btnMessage = "Actualizar";
          this.projectData.description = temp.description;
          this.projectData.members = temp.members;
        }
        return;
      } catch (error) {
        alert("error");
      }
    },
    async setupUpdate() {
      await this.getProjectDetails();
      await this.getUsers();
    },
    cancelUpdate() {
      this.$router.push("/projects-list");
    },
  },
  computed: {
    ...mapState(["userDB"]),
  },
  filters: {
    filterdate: function(date) {
      if (!date) return "";
      return moment(date).format("DD-MM-YYYY");
    },
  },
};
</script>
