<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    
    ...mapActions([ 'leerToken' ])
   
  },
  created(){
    // this.$http.interceptors.response.use(undefined, function(err){
    //   return new Promise(function(resolve, reject){
    //     if(err.status === 401 && err.config && !err.config._isRetryRequest){
    //       this.$store.dispatch(logout);
    //     }
    //     throw err;
    //   })
    // })
    this.leerToken();
  }
};
</script>