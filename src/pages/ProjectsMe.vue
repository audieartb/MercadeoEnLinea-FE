<template>
  <div
    class="
      md-layout-item
      md-medium-size-100
      md-xsmall-size-100
      md-medium-size-100
      md-large-size-100
      md-size-150
    "
  >
    <md-card>
      <md-card-header data-background-color="blue">
        <h4 class="title">Proyectos</h4>
        <p class="category"></p>
      </md-card-header>
      <md-card-content>
        <ProjectTableMe table-header-color="blue"></ProjectTableMe>
      </md-card-content>
    </md-card>
    <md-button class="md-info md-just-icon" to="/add-project"
      ><md-icon>add</md-icon></md-button
    >
  </div>
</template>

<script>
import { ProjectTableMe } from "@/components";
export default {
  components: {
    ProjectTableMe,
  },
};
</script>

<style>
</style>