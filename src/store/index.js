import Vue from "vue";
import Vuex from "vuex";
import router from "@/routes/routes";
import jwt_decode from "jwt-decode";
import axios from "axios";
import loginService from "../services/Users/login.services";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
    userDB: {},
    status: "",
    tempTask: null
  },
  mutations: {
    obtenerUser(state, payload) {
      state.token = payload;
      if (payload === "") {
        state.userDB = "";
      } else {
        state.userDB = jwt_decode(state.token);
        router.push({ name: "Dashboard" });
      }
    },
    authRequest(state) {
      state.status = "loading";
    },
    authSuccess(state, token) {
      state.status = "sucess";
      state.token = token;
      localStorage.setItem("token", token);
      state.userDB = jwt_decode(token);
    },
    authError(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    }
  },
  actions: {
    leerToken({ commit }) {
      const token = localStorage.getItem("token");
      if (token) {
        commit("authSuccess", token);
      }
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("authRequest");
        axios({
          //url: "http://localhost:3000/api/auth",
          url: "https://modules.mercadeoenlinea.com/api/auth",
          data: user,
          method: "POST",
        })
          .then(response => {
            axios.defaults.headers.common["Authorization"] =
              response.data.accessToken;
            commit("authSuccess", response.data.accessToken);
            
            resolve(response);
          })
          .catch(error => {
            commit("authError");
            localStorage.removeItem("token");
    
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        router.push({ path: "/login" });
        resolve();
      });
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },
});
