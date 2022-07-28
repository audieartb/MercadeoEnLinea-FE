<template>
  <div>
    <md-table v-model="events" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Título">{{
          item.title | capitalize
        }}</md-table-cell>
        <md-table-cell md-label="Inicia"
          >{{ item.start | filterDate }} -
          {{ item.startTime | filterTime }}</md-table-cell
        >
        <md-table-cell md-label="Finaliza"
          >{{ item.end | filterDate }} - {{ item.endTime }}</md-table-cell
        >
        <md-table-cell md-label="Actions">
          <small>
            <md-button
              class="md-just-icon md-simple md-info"
              @click="goToCalendar(item.id)"
            >
              <md-icon>event</md-icon>
              <md-tooltip md-direction="top">Ver en calendario</md-tooltip>
            </md-button>
            <md-button
              class="md-just-icon md-simple md-danger"
              @click="(showDialog = true), (tempId = item.id)"
            >
              <md-icon>delete</md-icon>
              <md-tooltip md-direction="top">Eliminar</md-tooltip>
            </md-button>
          </small>
        </md-table-cell>
      </md-table-row>

      <md-table-row class="md-layout-item md-size-100">
        <h5 class="md-alignment-center-center" :v-if="!events">
          No hay eventos, agrega en el <a href="/#/calendar">Calendario</a>
        </h5>
      </md-table-row>
    </md-table>
    <div class="md-layout md-gutter md-alignment-bottom-center">
      <div class="md-layout-item md-size-25 table-opt">
        <md-button
          class="md-raised md-primary"
          @click="prevBtn()"
          :disabled="this.page <= 1"
        >
          <md-icon>arrow_back_ios</md-icon></md-button
        >
      </div>
      <div class="md-layout-item md-size-25 table-opt">
        <h4>Página: {{ page }}</h4>
      </div>
      <div class="md-layout-item md-size-25 table-opt">
        <md-button class="md-raised md-primary" @click="nextBtn()"
          ><md-icon>arrow_forward_ios</md-icon></md-button
        >
      </div>
    </div>
    <md-dialog-confirm
      :md-active.sync="showDialog"
      md-title="Eliminar Evento"
      md-content="Seguro que quieres eliminar este Evento?
      También será eliminado del calendario"
      md-confirm-text="Si"
      md-cancel-text="Cancelar"
      @md-cancel="close"
      @md-confirm="deleteEvent"
    />
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import EventService from "../../services/Events/events.service";

export default {
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selected: [],
      events: [],
      showDialog: false,
      tempId: null,
      now: Date.now(),
      limit: 5,
      skip: 0,
      page: 1,
    };
  },
  methods: {
    veirfyDate(date) {
      if (Date.parse(date) > this.now) {
        return true;
      }
      return false;
    },
    async getEvents() {
      const today = new Date();
      return EventService.paginatedList(
        this.limit,
        this.skip,
        this.userDB.userId,
      ).then((response) => {
        if (response.length) {
          this.events = response;
          return true;
        }
        return false;
      });
    },
    nextBtn() {
      this.skip += this.limit;
      this.getEvents().then((res) => {
        if (res) {
          this.page++;
        } else {
          this.skip -= this.limit;
        }
      });
    },
    prevBtn() {
      if (this.page > 1) {
        this.skip -= this.limit;
        this.getEvents().then(() => {
          this.page--;
        });
      }
    },
    async deleteEvent() {
      await EventService.delete(this.tempId).then(() => {
        this.$notify({
          message: "Evento eliminado",
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "warning",
        });
        location.reload();
      });
    },
    close() {
      !this.showDialog;
      this.tempId = null;
    },
    goToCalendar(id) {
      this.$router.push(`/calendar/${id}`);
    },
  },
  computed: {
    ...mapState(["userDB"]),
  },
  created() {
    this.getEvents();
  },
  filters: {
    filterDate(date) {
      if (!date) return "";
      return moment(date).format("DD-MM-YYYY");
    },
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    filterTime(time) {
      if (!time) {
        return "todo el día";
      }
      return time;
    },
  },
};
</script>

<style lang="scss" scoped>
small {
  display: block;
}

.table-opt {
  display: grid;
  place-items: center;
}
</style>
