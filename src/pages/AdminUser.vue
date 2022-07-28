<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header data-background-color="blue">
            <h4 class="title">Administración de Usuarios</h4>
          </md-card-header>
          <md-card-content>
            <Admintab> </Admintab>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Admintab } from "@/components";

export default {
  components: {
    Admintab
  },
  methods:{
    
  }
};
</script>

<style>
</style>