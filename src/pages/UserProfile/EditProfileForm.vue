<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Editar el Perfil</h4>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Nombre</label>
              <md-input
                v-model="form.firstName"
                type="text"
                :disabled="disableEdit"
              ></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Apellido</label>
              <md-input
                v-model="form.lastName"
                type="text"
                :disabled="disableEdit"
              ></md-input>
            </md-field>
          </div>
         
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Teléfono</label>
              <md-input
                v-model="form.phoneNumber"
                type="text"
                :disabled="disableEdit"
              ></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Cargo</label>
              <md-input
                v-model="form.position"
                type="email"
                :disabled="disableEdit"
              ></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Correo</label>
              <md-input
                v-model="form.email"
                type="text"
                :disabled="disableEdit"
              ></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Contraseña</label>
              <md-input
                v-model="form.password"
                type="password"
                :disabled="disableEdit"
              ></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Confirmar Contraseña</label>
              <md-input
                v-model="form.passwordConfirm"
                type="password"
                :disabled="disableEdit"
              ></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-50 text-right">
            <md-button class="md-raised md-info" @click="disableEdit = false"
              >Actualizar Perfil</md-button
            >
          </div>
          <div class="md-layout-item md-size-25 text-left">
            <md-button
              class="md-raised md-info"
              :disabled="disableEdit"
              @click="updateUser"
              >Guardar</md-button
            >
          </div>
          <div class="md-layout-item md-size-25 text-left">
            <md-button
              class="md-raised md-danger"
              @click="disableEdit = true"
              :disabled="disableEdit"
              >Cancelar</md-button
            >
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
import UserService from "../../services/Users/users.service";
import { mapState } from "vuex";
export default {
  name: "edit-profile-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        id: null,
        phoneNumber: null,
        position: null,
        lastName: null,
        firstName: null,
        email: null,
        permissionLevel: null,
        password: null,
        passwordConfirm: null,
      },
      disableEdit: true,
    };
  },
  methods: {
    async getUser() {
      let userdata = await UserService.getUserById(this.userDB.userId);
      this.form.phoneNumber = userdata.phoneNumber;
      this.form.lastName = userdata.lastName;
      this.form.firstName = userdata.firstName;
      this.form.email = userdata.email;
      this.form.id = userdata.id;
    },
    async updateUser() {
      let data = JSON.parse(JSON.stringify(this.form));
      await UserService.updateUser(data)
        .then((response) => {
          if(password){
            this.form.password = null;
            this.form.passwordConfirm = null;
          }
          this.getUser()
        })
        .catch((error) => alert("error", error));
    },
    setUserData() {},
  },
  computed: {
    ...mapState(["userDB"]),
  },
  created() {
    this.getUser();
  },
};
</script>
<style></style>
