<template>
  <md-card md-with-hover class="project-tab">
    <div class="c-card-title">
      <h4>
        <b>{{ task.title | capitalize }}</b>
      </h4>
    </div>
    <div class="c-card-content">
      {{ task.description }}
    </div>
    <div class="md-layout card-bottom">
      <div class="md-layout-item" style="margin-top: 1rem">
        <span>documentos: {{ task.files | countfiles }}</span>
      </div>
      <div class="md-layout-item md-size-25 card-bottom-open">
        <MoTask :update="true" icon="open_in_new" :updateObjInfo="task" />
      </div>
    </div>
  </md-card>
</template>

<script>
import { ProjectTaskDetail, MoTask } from "@/components";

export default {
  components: {
    MoTask,
  },
  props: {
    task: Object,
  },
  data() {
    return {
      openDetails: false,
    };
  },
  methods: {
    changeOpenDetails() {
      this.openDetails = !this.openDetails;
    },
  },
  filters: {
    filterdate: function (date) {
      if (!date) return "";
      return moment(date).format("DD-MM-YYYY");
    },
    capitalize(value) {
      if (!value) {
        return "";
      }
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    countfiles(value) {
      if (value[0] == "null") {
        return 0;
      }
      return value.length;
    },
  },
};
</script>
<style>
.c-card-title {
  margin: 0 1em 0 1em;
}
.c-card-content {
  padding: 0;
  margin: 0 1em 1rem 1em;
}

.card-bottom {
  border-top-color: rgb(173, 173, 173);
  border-top: solid;
  border-width: 1px;
  max-height: 3.5rem;
}

.card-bottom-open {
  margin-bottom: 0.5rem;
}
</style>
