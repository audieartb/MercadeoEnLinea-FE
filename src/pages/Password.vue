<template>
  <div class="content center-2">
    <img src="../assets/img/ME2.png" width="400px" />
    <div class="md-layout">
      <div class="md-layout-item"></div>
      <div class="md-layout-item md-medium-size-100 md-size-36">
        <form>
          <md-card>
            <md-card-header data-background-color="blue">
              <h4 class="title">Recuperar Contraseña</h4>
            </md-card-header>
            <md-card-content>
              <div class="md-layout md-alignment-top-center">
                <div class="md-layout-item md-small-size-100 md-size-66">
                  <md-field>
                    <label>Correo Electronico</label>
                    <md-input v-model="emailadress" type="email"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-100 text-center">
                  <md-button class="md-raised md-info" type="info" @click="resetPassword()">
                    Enviar Correo
                  </md-button>
                </div>
                <div class="md-layout-item md-size-100 text-center">
                  <md-button class="md-raised md-info md-simple" to="/login">
                    Volver al Inicio de Sesión
                  </md-button>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </form>
        <h3>{{newpassword}}</h3>
      </div>
      <div class="md-layout-item"></div>
    </div>
  </div>
</template>
<script>
import usersService from "../services/Users/users.service";
import UserService from "../services/Users/users.service";

export default {
  data() {
    return {
      emailadress: null,
      newpassword: null,
    };
  },
  methods: {
    async resetPassword() {
      usersService
        .reset(this.emailadress)
        .then((data) => {
          this.newpassword = data
        })
        .catch((error) => {
          console.error("error ",error);
        });
    },
  },
};
</script>

 