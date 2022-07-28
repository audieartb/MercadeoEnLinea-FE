<template>
  <div>
    <md-dialog-confirm
      :md-active.sync="showDialog"
      :md-title="title"
      :md-content="message"
      md-confirm-text="Delete"
      md-cancel-text="Cancel"
      @md-cancel="close"
      @md-confirm="$emit('delete')"
    />

    <md-button class="md-danger md-raised" @click="showDialog = true"
      >Eliminar</md-button
    >
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    title: String,
  },
  data: () => ({
    showDialog: false,
  }),

  methods: {
    close() {
      this.showDialog = false;
    }
  },
};

//How to use this component
//  <DeleteConfirmation :message="String" title="String" 
//  v-on:delete="deleteTask(element.name)"/>

</script>

<style>
</style>