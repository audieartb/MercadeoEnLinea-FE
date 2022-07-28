<template>
  <div>
    <div></div>
    <md-table v-model="projects" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Nombre de Proyecto">{{
          item.projectName
        }}</md-table-cell>
        <md-table-cell md-label="Lider">{{ item.owner }}</md-table-cell>
        <md-table-cell md-label="Inicia">{{
          item.startDate | filterdate
        }}</md-table-cell>
        <md-table-cell md-label="Finaliza">{{
          item.endDate | filterdate
        }}</md-table-cell>
        <md-table-cell md-label="Acciones">
          <small>
            <md-button
              class="md-just-icon md-simple md-info"
              @click="redirectDetails(item.id)"
            >
              <md-icon>visibility</md-icon>
              <md-tooltip md-direction="top">Ver</md-tooltip>
            </md-button>

            <md-button
              class="md-just-icon md-simple md-info"
              @click="redirectEdit(item.id)"
            >
              <md-icon>edit</md-icon>
              <md-tooltip md-direction="top">Editar</md-tooltip>
            </md-button>
            <md-button
              class="md-just-icon md-simple md-info"
              @click="(showDialog = true), (tempId = item.id)"
            >
              <md-icon>delete</md-icon>
              <md-tooltip md-direction="top">Borrar</md-tooltip>
            </md-button>
          </small>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <md-dialog-confirm
      :md-active.sync="showDialog"
      md-title="Eliminar Proyecto"
      md-content="Estás seguro que quieres eliminar este proyecto?"
      md-confirm-text="Eliminar"
      md-cancel-text="Cancelar"
      @md-cancel="close"
      @md-confirm="deleteProject"
    />
  </div>
</template>

<script>
import ProjectsService from "../../services/Projects/projects.service";
import moment from "moment";
import { mapState } from "vuex";
export default {
  name: "project-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selected: [],
      showDialog: false,
      tempId: null,
      projects: [],
      test: {},
    };
  },
  created() {
    this.getProjectsData();
  },
  methods: {
    async getProjectsData() {
      this.projects = await ProjectsService.getAll(this.userDB.userId);

      if (this.projects) {
        this.projects.forEach((e) => {
          e.owner = this.userDB.name;
        });
      }
    },
    deleteProject() {
      let res = ProjectsService.delete(this.tempId).then(() => {
        const removeIndex = this.projects.findIndex(
          (item) => item.id === this.tempId,
        );
        this.projects.splice(removeIndex, 1);
        this.tempId = null;
        this.$notify({
          message: "Proyecto eliminado",
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "warning",
        });
        location.reload();
      });
    },
    close() {
      !this.showDialog;
      this.tempId = null;
    },
    createProject() {
      let res = ProjectsService.createProject()
        .then(() => {
          this.$notify({
            message: "Proyecto creado",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });
          location.reload();
        })
        .catch(() => {
          this.$notify({
            message: "Error creando Proyecto",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger",
          });
          location.reload();
        });
    },
    redirectDetails(id) {
      this.$router.push(`/project/${id}`);
    },
    redirectEdit(id) {
      this.$router.push(`edit-project/${id}`);
    },
  },
  filters: {
    filterdate: function (date) {
      if (!date) return "";
      return moment(date).format("DD-MM-YYYY");
    },
  },
  computed: {
    ...mapState(["userDB"]),
  },
};
</script>

<style lang="scss" scoped>
small {
  display: block;
}
</style>