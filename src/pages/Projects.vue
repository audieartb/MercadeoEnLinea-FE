<template>
  <div class="content">
    <cube-spin></cube-spin>
    <div class="md-layout">
      <md-card>
        <md-card-header data-background-color="blue">
          <h4 class="title">Información del Proyecto</h4>
        </md-card-header>
        <md-card-content>
          <p>Nombre del proyecto: {{ project.projectName }}</p>
          <p>Dueño del proyecto: {{ user.firstName }} {{ user.lastName }}</p>
          <p>Fecha límite de entrega: {{ project.endDate | filterdate }}</p>
          <p>{{ project.description }}</p>
        </md-card-content>
      </md-card>
      <div class="md-layout-item">
        <md-card>
          <md-card-header data-background-color="blue">
            <h4 class="title">Tareas</h4>
          </md-card-header>
          <md-card-content>
            <draggable
              id="pending"
              @end="onChange"
              class="list-group kanban-column"
              :list="listPending"
              group="proyectos"
            >
              <div
                class="list-group-item"
                v-for="element in listPending"
                :key="element.title"
              >
                <TaskCard :task="element" />
              </div>
            </draggable>

            <div>
              <MoTask
                :projectId="project.id"
                v-on:modalToProject="addTask"
                icon="add"
              ></MoTask>
            </div>
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item">
        <md-card>
          <md-card-header data-background-color="orange">
            <h4 class="title">En Curso</h4>
          </md-card-header>
          <md-card-content>
            <draggable
              id="doing"
              @end="onChange"
              class="list-group kanban-column"
              :list="listDoing"
              group="proyectos"
            >
              <div
                class="list-group-item"
                v-for="element in listDoing"
                :key="element.title"
              >
                <TaskCard :task="element" />
              </div>
            </draggable>
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Finalizadas</h4>
          </md-card-header>
          <md-card-content>
            <draggable
              id="done"
              @end="onChange"
              class="list-group kanban-column"
              :list="listDone"
              group="proyectos"
            >
              <div
                class="list-group-item"
                v-for="element in listDone"
                :key="element.title"
              >
                <TaskCard :task="element" />
              </div>
            </draggable>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <md-dialog-confirm
      :md-active.sync="showDialog"
      md-title="Eliminar tarea"
      md-content="Está seguro?"
      md-confirm-text="Borrar"
      md-cancel-text="Cancelar"
      @md-cancel="close"
      @md-confirm="deleteTask(value)"
    />
  </div>
</template>

<script>
import CubeSpin from 'vue-loading-spinner'
import draggable from "vuedraggable";
import TaskService from "../services/Projects/tasks.service.js";
import { TaskCard, MoTask } from "@/components";
import projectService from "../services/Projects/projects.service";
import userService from "../services/Users/users.service";
import moment from "moment";
export default {
  name: "LayoutHorizontalColumns",
  name: "projects-table",
  components: {
    draggable,
    TaskCard,
    MoTask,
    CubeSpin,
  },
  data() {
    return {
      nuevoProyecto: "",
      allTasks: [],
      listPending: [],
      listDoing: [],
      listDone: [],
      tempTaskId: 1,
      tempProjectId: 1,
      value: null,
      showDialog: false,
      project: null,
      user: null,
      updateTask: {
        taskId: null,
        status: null,
      },
    };
  },
  methods: {
    // add: function () {
    //   if (this.nuevoProyecto) {
    //     this.listPending.push({ name: this.nuevoProyecto });
    //     this.nuevoProyecto = "";
    //   }
    // },
    deleteTask(value) {
      //var tempData = { taskId: this.tempTaskId, projectId: this.tempProjectId };
      (value);

      // TaskService.delete(tempData).then(() => {
      //   const removeIndex = this.listPending.findIndex(
      //     item => item.user === this.value,
      //   );
      //   this.listPending.splice(removeIndex, 1);
      // });
    },
    close() {
      return null;
    },
    addTask(value) {
      this.listPending.push(value);
    },
    async getProjectById() {
      let id = this.$route.params.id;
      this.project = await projectService.getById(id).then((response) => {
        return response.data;
      });

      this.user = await userService.getUserById(this.project.owner);
      await TaskService.getTasks(this.project.id).then((response) => {
        this.sortTasks(response);
      });
    },
    sortTasks(list) {
      list.forEach((element) => {
        if (element.status == "pending") {
          this.listPending.push(element);
        } else if (element.status == "doing") {
          this.listDoing.push(element);
        } else {
          this.listDone.push(element);
        }
      });
    },
    onChange(value) {
      this.updateTask.taskId = value.item._underlying_vm_.id;
      this.updateTask.status = value.to.id;
      this.updateStatus();
    },
    updateStatus() {
      TaskService.updateStatus(this.updateTask);
    },
  },
  created() {
    this.getProjectById();
  },
  filters: {
    filterdate: function (date) {
      if (!date) return "";
      return moment(date).format("DD-MM-YYYY");
    },
    uppercase(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
   computed: {
    styles () {
      return {
        width: '40px',
        height: '40px',
        backgroundColor: '#41b883',
        animationDuration: '1.8s'
      }
    }
  }
};
</script>

<style>
.kanban-column {
  min-height: 500px;
  color: black;
}
.project-tab {
  text-align: start;
  padding: 2%;
  color: black;
}
</style>
