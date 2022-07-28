<template>
  <div class="content">
    <!-- <NotificationsTable table-header-color="red"></NotificationsTable> -->
    <div class="construction-img">
      <img class="img" :src="construction" />
    </div>
  </div>
</template>

<script>
import { NotificationsTable } from "@/components";

export default {
  components: {
    //NotificationsTable
  },
  data() {
    return {
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false,
      },

      construction: require("@/assets/img/building.png"),
    };
  },
  methods: {
    notifyVue(verticalAlign, horizontalAlign, message, type) {
      var color = Math.floor(Math.random() * 4 + 1);
      this.$notify({
        message: message,
        icon: "add_alert",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: type,
      });
    },
  },
};
</script>

<style scoped>
.construction-img {
  width: 200px;
  height: 200px;
}

.content {
  display: grid;
  place-items: center;
}
</style>