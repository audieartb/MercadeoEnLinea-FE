<template>
  <div class="dashboard-projects md-layout md-alignment-center-center">
    <div class="scroll-btn-container md-layout-item md-size-10">
      <md-button class="md-just-icon md-simple md-info" @click="scroll_left">
        <md-icon>arrow_back_ios</md-icon>
      </md-button>
    </div>
    <div
      id="scroll-cards"
      class="wrapper-box md-layout-item md-size-80 md-elevation-4"
    >
      <div
        v-for="card in projects"
        :key="card.id"
        class="card project-card"
        style="min-height: 430px"
      >
        <img
          class="card-img-top img-fluid"
          src="../../assets/img/project-card-default.jpg"
          alt="Card image cap"
        />
        <div class="card-body">
          <span class="card-title"
            ><b>{{ card.projectName }}</b></span
          >
          <div style="min-height: 63px">
            <p class="card-text">
              {{ card.description }}
            </p>
          </div>
          <h4>{{ card.owner }}</h4>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Tareas pendientes: {{ card.count }}</li>
          <li class="list-group-item">
            Due Date: {{ card.endDate | dateFilter }}
          </li>
        </ul>
        <div
          class="
            card-body card-body-bottom
            md-layout md-alignment-center-right md-size-100
          "
        >
          <a
            @click="redirectToProject(card.id)"
            class="card-link md-layout-item md-size-100 hover-pointer"
          >
            Go to project <span class="material-icons"> chevron_right </span></a
          >
        </div>
      </div>
    </div>

    <div class="scroll-btn-container md-layout-item md-size-10">
      <md-button class="md-just-icon md-simple md-info" @click="scroll_right">
        <md-icon>arrow_forward_ios</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import ProjectService from "../../services/Projects/projects.service";
import tasksService from "../../services/Projects/tasks.service";
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "card-container",
  data() {
    return {
      projects: [],
    };
  },
  methods: {
    scroll_left() {
      let content = document.querySelector("#scroll-cards");
      content.scrollLeft -= 200;
    },

    scroll_right() {
      let content = document.querySelector("#scroll-cards");
      content.scrollLeft += 200;
    },
    async getProjects() {
      this.projects = await ProjectService.getAll(this.userDB.userId);
      this.projects.forEach(async (pr) => {
        pr.count = await tasksService.countTasks(pr.id);
        this.$forceUpdate();
      });

    },
    redirectToProject(id) {
      this.$router.push(`/project/${id}`);
    },
    getCount() {},
  },
  computed: {
    ...mapState(["userDB"]),
  },
  created() {
    this.getProjects();
  },
  filters: {
    dateFilter(date) {
      return moment(date).format("MM-DD-YYYY");
    },
  },
};
</script>

<style>
.hover-pointer {
  cursor: pointer;
}
</style>