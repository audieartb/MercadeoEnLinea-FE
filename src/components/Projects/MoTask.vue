<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>
        <div class="md-layout">
          <span v-if="update" class="md-layout-item md-size-75"
            >Actualizar Tarea</span
          >
          <span v-else class="md-layout-item md-size-75">Agregar Tarea</span>
          <div class="md-alignment-top-right md-layout">
            <md-button
              class="md-info md-just-icon md-alignment-top-right"
              @click="clearForm"
              ><span style="font-size: 1rem">x</span></md-button
            >
          </div>
        </div>
      </md-dialog-title>
      <md-dialog-content>
        <form class="md-layout" @submit.prevent="validateForm">
          <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-100">
                  <md-field :class="getValidationClass('title')">
                    <label for="title">Titulo de tarea</label>
                    <md-input
                      name="title"
                      id="title"
                      v-model="form.title"
                      :disabled="sending"
                    />
                    <span class="md-error" v-if="!$v.form.title.required"
                      >Campo requerido</span
                    >
                    <span class="md-error" v-else-if="!$v.form.title.minlength"
                      >Dato inválido</span
                    >
                  </md-field>
                </div>

                <div class="md-layout-item md-size-100">
                  <md-field :class="getValidationClass('description')">
                    <label for="description">Descripción</label>
                    <md-input
                      name="description"
                      id="description"
                      v-model="form.description"
                      :disabled="sending"
                    />
                    <span class="md-error" v-if="!$v.form.description.required"
                      >Campo requerido</span
                    >
                    <span
                      class="md-error"
                      v-else-if="!$v.form.description.minlength"
                      >Dato inválido</span
                    >
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="status">Estado</label>
                    <md-select
                      name="status"
                      id="status"
                      v-model="form.status"
                      :disabled="sending"
                    >
                      <md-option value="pending">Pendiente</md-option>
                      <md-option value="doing">En Progreso</md-option>
                      <md-option value="finished">Finalizada</md-option>
                    </md-select>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <input
                      type="file"
                      ref="file"
                      name="taskFile"
                      @change="
                        uploadFile($event.target.name, $event.target.files)
                      "
                      multiple
                    />
                  </md-field>
                </div>
                <div v-if="form.files" class="md-layout-item md-size-50">
                  <md-chip
                    @md-delete="onChipDelete(item)"
                    md-deletable
                    md-clickable
                    v-for="(item, index) in form.files"
                    :key="index"
                  >
                    <a
                      @click="downloadFile(item.path, item.originalname)"
                      href="#"
                      >{{ item.originalname }}</a
                    >
                  </md-chip>
                </div>
              </div>
            </md-card-content>

            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <md-card-actions> </md-card-actions>
          </md-card>

          <md-snackbar :md-active.sync="userSaved"
            >La tarea {{ form.taskName }} ha sido creada.</md-snackbar
          >
          <md-dialog-actions>
            <md-button
              class="md-info"
              @click="(deleteConfirmation = true), (value = form.id)"
              >Eliminar</md-button
            >
            <md-button
              v-if="update"
              type="submit"
              class="md-info"
              :disabled="sending"
              >Actualizar</md-button
            >
            <md-button v-else type="submit" class="md-info" :disabled="sending"
              >Crear tarea</md-button
            >
          </md-dialog-actions>
        </form>
      </md-dialog-content>

      <md-dialog-confirm
        :md-active.sync="deleteConfirmation"
        md-title="¿Eliminar Tarea?"
        md-confirm-text="Sí"
        md-cancel-text="No"
        @md-cancel="onCancelDelete"
        @md-confirm="deleteTask"
      />
    </md-dialog>

    <md-button class="md-info md-just-icon" @click="showDialog = true"
      ><md-icon>{{ icon }}</md-icon></md-button
    >
  </div>
</template>

<script>
//import { FormTask } from "@/components";
import { mapState } from "vuex";
import TaskService from "../../services/Projects/tasks.service";
import FileService from "../../services/Files/file.service";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength,
  alphaNum,
} from "vuelidate/lib/validators";

export default {
  name: "DialogCustom",
  props: {
    projectId: String,
    update: {
      type: Boolean,
      default: false,
    },
    icon: String,
    updateObjInfo: Object,
  },
  mixins: [validationMixin],
  data: () => ({
    deleteConfirmation: false,
    value: "",
    updating: null,
    showDialog: false,
    form: {
      title: null,
      description: null,
      status: null,
      userId: null,
      projectId: null,
      files: null,
    },
    taskFile: null,
    uploadFiles: [],
    userSaved: false,
    sending: false,
    lastUser: null,
  }),
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(3),
      },
      description: {
        required,
        minLength: minLength(3),
      },
    },
  },
  components: {},
  methods: {
    // modalToProject(value) {
    //   this.$emit("modalToProject", value);
    // },
    onCancelDelete() {},
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      if (!this.update) {
        this.showDialog = false;
        this.$v.$reset();
        this.form.title = null;
        this.form.description = null;
        this.form.status = null;
        this.form.files = null;
        this.sending = false;
      }
      this.showDialog = false;
      this.$v.$reset();
      this.sending = false;
    },
    uploadFile(filename, files) {
      if (!files.length) {
        return;
      }
      this.uploadFiles = files;
    },
    saveTask() {
      this.sending = true;
      this.form.userId = this.userDB.userId;
      if (!this.update) {
        this.form.projectId = this.projectId;
      }

      const formData = new FormData();
      for (const field in this.form) {
        formData.append(field, this.form[field]);
      }
      if (this.uploadFiles.length) {
        for (let i = 0; i < this.uploadFiles.length; i++) {
          formData.append("taskFile", this.uploadFiles[i]);
        }
      }

      if (this.update) {
        TaskService.update(formData)
          .then(() => {
            this.$emit("modalToProject", this.form);
            this.clearForm();
            this.showDialog = false;
            this.sending = false;
            this.$notify({
              message: "Tarea actualizada",
              icon: "add_alert",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "success",
            });
            location.reload();
          })
          .catch((error) => {
            this.clearForm();
            this.showDialog = false;
            this.sending = false;
            this.$notify({
              message: "Error actualizando tarea",
              icon: "add_alert",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "danger",
            });
          });
      } else {
        {
          TaskService.create(formData)
            .then(() => {
              this.$emit("modalToProject", this.form);
              this.clearForm();
              this.showDialog = false;
              this.sending = false;
              this.$notify({
                message: "Tarea agregada",
                icon: "add_alert",
                horizontalAlign: "center",
                verticalAlign: "top",
                type: "success",
              });
              location.reload();
            })
            .catch((error) => {
              this.clearForm();
              this.showDialog = false;
              this.sending = false;
              this.$notify({
                message: "Error creando tarea",
                icon: "add_alert",
                horizontalAlign: "center",
                verticalAlign: "top",
                type: "danger",
              });
            });
        }
      }
    },
    deleteTask() {
      TaskService.delete(this.value).then(() => {
        this.clearForm();
        this.$notify({
          message: "Tarea eliminada",
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "warning",
        });
        location.reload();
      });
    },
    setUpdateInfo() {
      if (this.update) {
        this.form.title = this.updateObjInfo.title;
        this.form.description = this.updateObjInfo.description;
        this.form.status = this.updateObjInfo.status;
        this.form.files = this.updateObjInfo.files;
        this.form.projectId = this.updateObjInfo.projectId;
        this.form.id = this.updateObjInfo.id;
      }
    },
    downloadFile(path, originalname) {
      FileService.downloadFile(path, originalname);
    },
    validateForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveTask();
      }
    },
    onChipDelete(value) {
      const data = {
        id: this.updateObjInfo.id,
        path: value.path,
        filename: value.filename,
      };
      TaskService.deleteFile(data).then(() => {
        this.$notify({
          message: "documento eliminado",
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "warning",
        });
      });
    },
  },
  computed: {
    ...mapState(["userDB"]),
  },
  filters: {
    sliceFilename(value) {
      if (!value) {
        return;
      }
      return value.split("--")[1];
    },
  },
  created() {
    this.setUpdateInfo();
  },
};
</script>
