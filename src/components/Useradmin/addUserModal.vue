<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <div class="md-layout md-gutter" style="padding: 0.5rem">
        <div class="md-layout-item md-size-50 mt-3">
          <md-dialog-title>
            <div class="md-layout">
              <span>Agregar Usuario</span>
              <div class="md-alignment-top-right"></div>
            </div>
          </md-dialog-title>
        </div>
        <div class="md-layout-item md-size-50">
          <div class="md-layout md-alignment-top-right">
            <div class="layout-item">
              <button
                style="border: none"
                @click="showDialog = false"
                class="md-fab md-mini md-info"
              >
                <span class="material-icons"> close </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <md-dialog-content>
        <AddUserForm v-on:formToModal="newUserData"></AddUserForm>
      </md-dialog-content>
    </md-dialog>

    <md-button class="md-info md-just-icon" @click="showDialog = true"
      ><md-icon>add</md-icon></md-button
    >
  </div>
</template>

<script>
//import { AddUserForm } from "./addUserForm";

export default {
  name: "add-user-modal",
  data() {
    return {
      showDialog: false,
      firstname: "",
    };
  },
  components: {
    AddUserForm: () => import("./addUserForm.vue"),
  },
  methods: {
    newUserData(value) {
      this.showDialog = false;
      this.$emit("modalToAdmin", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.md-dialog .md-dialog-container {
}
</style>
