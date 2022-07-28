<template>
  <div>
    <md-card class="md-card-profile">
      <div class="md-card-avatar">
        <img class="img" :src="cardUserImage" />
      </div>
      <div style="margin: 0; padding: 0">
        <span class="material-icons"> camera_enhance </span>
      </div>

      <md-card-content>
        <h6 class="category text-gray"></h6>
        <h4 class="card-title">{{ userDB.name }}</h4>
      </md-card-content>
    </md-card>
    <input
      type="file"
      ref="file"
      @change="uploadFile($event.target.files)"
      multiple
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import UserService from "../../services/Users/users.service";
export default {
  name: "user-card",
  props: {
    cardUserImage: {
      type: String,
      default: require("@/assets/img/faces/fox.png"),
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["userDB"]),
  },
  methods: {
    uploadFile(file) {
      if (!file) {
        return;
      }
      const formData = new FormData();
      formData.append("profilepic", file);
      
    },
  },
};
</script>
<style></style>
