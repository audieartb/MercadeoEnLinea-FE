<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-100 md-small-size-100">
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('firstName')">
                <label for="first-name">Nombre</label>
                <md-input
                  name="first-name"
                  id="first-name"
                  autocomplete="given-name"
                  v-model="form.firstName"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.firstName.required"
                  >Campo requerido</span
                >
                <span class="md-error" v-else-if="!$v.form.firstName.minlength"
                  >Dato inválido</span
                >
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('lastName')">
                <label for="last-name">Apellidos</label>
                <md-input
                  name="last-name"
                  id="last-name"
                  autocomplete="family-name"
                  v-model="form.lastName"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.lastName.required"
                  >Campo requerido</span
                >
                <span class="md-error" v-else-if="!$v.form.lastName.minlength"
                  >Dato inválido</span
                >
              </md-field>
            </div>
          </div>

          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('phoneNumber')">
              <label for="num">Teléfono</label>
              <md-input
                name="num"
                id="num"
                autocomplete="Number"
                v-model="form.phoneNumber"
                :disabled="sending"
              />
              <span class="md-error" v-if="!$v.form.phoneNumber.required"
                >Campo requerido</span
              >
              <span class="md-error" v-else-if="!$v.form.phoneNumber.minlength"
                >Dato inválido</span
              >
              <span class="md-error" v-else-if="!$v.form.phoneNumber.numeric"
                >Solo puede contener numeros</span
              >
            </md-field>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('role')">
                <label for="role">Rol</label>
                <md-select
                  name="role"
                  id="role"
                  v-model="form.permissionLevel"
                  md-dense
                  :disabled="sending"
                >
                  <md-option></md-option>
                  <md-option value="Administrador">Administrador</md-option>
                  <md-option value="Editor">Editor</md-option>
                  <md-option value="Basico">Básico</md-option>
                  
                </md-select>
                <span class="md-error">Campo requerido</span>
              </md-field>
            </div>
          </div>
          <md-field :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.email.required"
              >Campo Requerido</span
            >
            <span class="md-error" v-else-if="!$v.form.email.email"
              >Dato inválido</span
            >
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-info" :disabled="sending">{{
            btnMessage
          }}</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="userSaved"
        >El usuario{{ lastUser }} ha sido creado.</md-snackbar
      >
    </form>
  </div>
</template>

<script>
import UserService from "../../services/Users/users.service";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength,
  alpha,
  numeric,
} from "vuelidate/lib/validators";

export default {
  name: "add-user-form",
  mixins: [validationMixin],
  props: {
    userData: null,
    update: Boolean,
  },
  data() {
    return {
      btnMessage: "",
      form: {
        userId: null,
        firstName: null,
        lastName: null,
        phoneNumber: null,
        permissionLevel: null,
        email: null,
        dateCreated: this.getDateNow(),
      },
      userSaved: false,
      sending: false,
      lastUser: null,
    };
  },
  validations: {
    form: {
      firstName: {
        required,
        minLength: minLength(3),
        alpha,
      },
      lastName: {
        required,
        minLength: minLength(3),
        alpha,
      },
      phoneNumber: {
        required,
        minLength: minLength(8),
        numeric,
      },
      permissionLevel: {
        required,
      },
      email: {
        required,
        email,
      },
    },
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.firstName = null;
      this.form.lastName = null;
      this.form.phoneNumber = null;
      this.form.permissionLevel = null;
      this.form.email = null;
      this.form.dateCreated = null;
    },
    async saveUser() {
      this.sending = true;

      const unwrapped = JSON.parse(JSON.stringify(this.form));

      if (this.update) {
        let res = await UserService.updateUser(unwrapped).then(() => {
          this.emit("formToModal", unwrapped);

          this.clearForm();
          location.reload();
        });
      } else {
        await UserService.createUser(unwrapped)
          .then(() => {
            this.emit("formToModal", unwrapped);
            this.clearForm();
            this.$notify({
              message: "Se agregó al usuario exitosamente",
              icon: "add_alert",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "info",
            });
          })
          .catch((error) => {
            alert(error.message);
            error.message;
            this.sending = false;
            this.$notify({
              message: error.message,
              icon: "add_alert",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "danger",
            });
          });
      }
    },
    validateUser() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },
    emit(eventName, value) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName, value);
        this.$nextTick(resolve);
      });
    },
    getDateNow() {
      let today = new Date();
      return (
        today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear()
      );
    },
    userUpdate() {
      if (this.userData) {
        (this.form = this.userData), (this.btnMessage = "Actualizar");
      } else {
        this.btnMessage = "Crear usuario";
      }
    },
  },

  created() {
    this.userUpdate();
  },
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>
