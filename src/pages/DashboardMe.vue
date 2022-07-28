<template>
  <div class="content">
    <div class="md-layout">

      <div
        class="
          md-layout-item
          md-medium-size-100
          md-xsmall-size-100
          md-medium-size-100
          md-large-size-100
          md-size-150
        "
      >
        <md-card>
          <md-card-header data-background-color="blue">
            <h4 class="title">Proximos Eventos</h4>
            {{ userDB.permissionLevel }}
          </md-card-header>
          <md-card-content>
            <OrderedTableMe table-header-color="blue"></OrderedTableMe>
          </md-card-content>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <CardContainer> </CardContainer>
      </div>
    </div>
  </div>
</template>

<script>
import { OrderedTableMe, CardContainer, StatsCard } from "@/components";
import { mapState } from "vuex";

export default {
  components: {
    CardContainer,
    OrderedTableMe,
  },
  data() {
    return {
      disableDelete: Boolean,
    };
  },
  methods: {
    deleteButton() {
      if(this.userDB.permissionLevel != 'admin' || this.userDB.userId != this.project.userId){
        this.disableDelete = true
      }
       
    },
  },
  computed: {
    ...mapState(["userDB"]),
  },
  created() {
    this.deleteButton();
  },
};
</script>
