<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout md-gutter" style="margin-left: 6px">
        <div>
          <!-- <EventModal ref="new"></EventModal> -->
          <EditEventModal ref="new"></EditEventModal>
        </div>
        <div hidden="true">
          <EditEventModal ref="edit"></EditEventModal>
        </div>
        <div class="layout-item md-size-25">
          <md-button @click="toggleWeekends">{{ weekendsMessage }}</md-button>
        </div>
      </div>

      <div class="md-layout-item md-size-100">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin, { DayGridView } from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import EventService from "../services/Events/events.service";
import { mapActions, mapState } from "vuex";
import { EventModal, EditEventModal } from "@/components";
import moment from "moment";
export default {
  components: {
    FullCalendar,
    //EventModal,
    EditEventModal,
  },
  props: {
    openEventId: String,
  },
  data() {
    return {
      calendarOptions: {
        locale: esLocale,
        dayMaxEventRows: true,
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        events: [],
        weekends: true,
        weekNumbers: true,
        height: 700,
        weekText: "Sem.",
        //timeZone: "Central Standard Time",
        eventTimeFormat: {
          hour: "2-digit",
          minute: "2-digit",
        },
        // initialView: 'dayGridWeek'
        textColor: "black",
        headerToolbar: {
          start: "dayGridWeek dayGridMonth",
          end: "today prev next",
          center: "title",
        },
      },
      weekendsMessage: "ver Semana Laboral",
      window: {
        width: 0,
        height: 0,
      },
      toggleWeekMonth: false,
      recurrentMonthly: [],
    };
  },
  methods: {
    async handleDateClick(arg) {
      await this.$refs.new.new(arg.date);
    },
    toggleWeekends: function () {
      this.calendarOptions.weekends = !this.calendarOptions.weekends;
      if (this.calendarOptions.weekends) {
        this.weekendsMessage = "ver Semana Laboral";
      } else {
        this.weekendsMessage = "ver Semana Completa";
      }
    },
    async handleEventClick(info) {
      let id = info.event.id;
      let temp = await this.findEvent(id);
      const confirmation = await this.$refs.edit.open(temp);
    },
    async findEvent(id) {
      const data = await this.calendarOptions.events.find((el) => el.id == id);
      return data;
    },
    async getEvents() {
      let data = await EventService.getAll(this.userDB.userId);

      data.forEach((e) => {
        if (e.startRecur == null) {
          this.calendarOptions.events.push(this.parseNormalEvent(e));
        } else {
          this.calendarOptions.events.push(this.parseRecurrentEvent(e));
        }
      });

      this.openEvent();
    },
    parseNormalEvent(e) {
      try {
        let startH = e.startTime ? parseInt(e.startTime.split(":")[0]) : null;
        let startM = e.startTime ? parseInt(e.startTime.split(":")[1]) : null;
        let endH = e.endTime ? parseInt(e.endTime.split(":")[0]) : null;
        let endM = e.endTime ? parseInt(e.endTime.split(":")[1]) : null;
        let start = moment(e.start).format("MM-DD-YYYY");

        start = new Date(start);
        let end = new Date(e.end);
        start.setHours(startH, startM);
        end.setHours(endH, endM);
        let normal = {
          allDay: false,
          id: e.id,
          title: e.title,
          start: start,
          end: end,
          description: e.description,
          color: e.color,
          overlap: true,
          eventFiles: e.eventFiles,
          sharedId: e.sharedId,
        };

        return normal;
      } catch (error) {
        console.log(error);
      }
    },
    parseRecurrentEvent(e) {
      let recurrent = {
        allDay: e.allDay,
        id: e.id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        description: e.description,
        startRecur: new Date(e.startRecur),
        endRecur: new Date(e.endRecur),
        color: e.color,
        startTime: e.startTime,
        endTime: e.endTime,
        overlap: true,
        daysOfWeek: e.daysOfWeek,
        eventFiles: e.eventFiles,
      };

      return recurrent;
    },
    // parseMonthly(e) {
    //   try {
    //     let startH = e.startTime ? parseInt(e.startTime.split(":")[0]) : null;
    //     let startM = e.startTime ? parseInt(e.startTime.split(":")[1]) : null;
    //     let endH = e.endTime ? parseInt(e.endTime.split(":")[0]) : null;
    //     let endM = e.endTime ? parseInt(e.endTime.split(":")[1]) : null;
    //     let start = moment(e.start).format("MM-DD-YYYY");
    //     start = new Date(start);
    //     let end = new Date(e.end);
    //     start.setHours(startH, startM);
    //     end.setHours(endH, endM);
    //     let normal = {
    //       allDay: false,
    //       id: e.id,
    //       title: e.title,
    //       start: start,
    //       end: end,
    //       description: e.description,
    //       color: e.color,
    //       overlap: true,
    //       eventFiles: e.eventFiles,
    //     };

    //     console.log(events);

    //     return normal;
    //   } catch (error) {
    //     console.log("parsing error", error);
    //   }
    // },
    // parseYearly() {},
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      if (this.window.width < 400) {
        this.calendarOptions.initialView = "dayGridDay";
      } else if (this.window.width < 1280) {
        this.calendarOptions.initialView = "dayGridWeek";
      } else {
        this.calendarOptions.initialView = "dayGridMonth";
      }
    },
    async openEvent() {
      if (this.openEventId != null) {
        let temp = await this.findEvent(this.openEventId);
        const dummy = this.$refs.edit.open(temp);
      }
    },
  },

  created() {
    this.getEvents();
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  computed: {
    ...mapState(["userDB"]),
  },
};
</script>

<style>
@import "../../node_modules/vue2-timepicker/dist/VueTimepicker.css";
</style>
