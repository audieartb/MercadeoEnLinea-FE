import Vue from "vue";
import App from "./App";
import Vuex from 'vuex'

import router from "./routes/routes";
import VueTimepicker from 'vue2-timepicker'

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";
import Chartist from "chartist";

import axios from 'axios'
Vue.prototype.$http = axios;

// Vue.prototype.$http.defaults.baseURL = 'https://modules.mercadeoenlinea.com/api';
Vue.prototype.$http.defaults.baseURL = 'http://localhost:3000/api';

const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}


Vue.config.productionTip = false

Vue.prototype.$Chartist = Chartist;

Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);
Vue.use(Vuex)

import store from './store/index'
new Vue({
  el: "#app",
  render: h => h(App),
  store,
  router,
  data: {
    Chartist: Chartist
  }
});



