<template>
  <div class="content center-2">
    <img src="../assets/img/ME2.png" width="400px" />
    <div class="md-layout">
      <div class="md-layout-item"></div>
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <form @submit.prevent="userLogin">
          <md-card>
            <md-card-header data-background-color="blue">
              <h4 class="title">Inicio de sesión</h4>
            </md-card-header>

            <md-card-content>
              <div class="md-layout md-alignment-top-center">
                <div class="md-layout-item md-small-size-100 md-size-66">
                  <md-field>
                    <label>Correo Electronico</label>
                    <md-input
                      type="email"
                      class="form-control my-2"
                      v-model="user.email"
                    ></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-66">
                  <md-field>
                    <label>Contraseña</label>
                    <md-input
                      type="password"
                      v-model="user.password"
                      class="form-control my-2"
                    ></md-input>
                  </md-field>
                </div>
                <div
                  v-if="message"
                  class="md-layout-item md-size-100 text-center"
                >
                  <span style="color: red">{{ message }}</span>
                </div>
                <div class="md-layout-item md-size-100 text-center">
                  <md-button class="md-raised md-info" type="submit">
                    Iniciar sesión
                  </md-button>
                </div>
                <div class="md-layout-item md-size-100 text-center">
                  <md-button class="md-raised md-info md-simple" to="/password">
                    ¿Olvidó su contraseña?
                  </md-button>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </form>
      </div>
      <div class="md-layout-item"></div>
    </div>
  </div>
</template>

<style>
.center-2 {
  text-align: center;
}
.center-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 400px;
}
</style>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      user: { email: "", password: "" },
      message: "",
      status: null,
      failTime: 30,
    };
  },
  methods: {
    ...mapActions(["guardarUser", "login"]),
    async userLogin() {
      this.login(this.user)
        .then(res => {
      
          this.$router.push({ name: "Dashboard" });
        })
        .catch(error => {
          if (error.response) {
            this.status = error.response.status;
            if (this.status == 400 || error.response.status == 401) {
              this.message = "Credenciales Inválidos";
            } else if (this.status == 500) {
              this.message = "Error interno";
            } else if (this.status == 404) {
              this.message = "No ha comunicación con el servidor";
            } else if (this.status == 429) {
              this.timeout();
              this.message = `3 Intentos fallidos, espera ${this.failTime} segundos`;
            }
          } else {
            this.message = "Error de conexión";
          }
        });
    },
  },
};
</script>
