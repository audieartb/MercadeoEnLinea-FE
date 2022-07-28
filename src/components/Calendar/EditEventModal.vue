<template>
  <div>
    <md-dialog :md-active.sync="showDialog" id="eventModal">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-50">
          <md-dialog-title>{{ modalTitle }} Evento</md-dialog-title>
        </div>
        <div class="md-layout-item md-size-50">
          <div class="md-layout md-alignment-top-right">
            <div class="layout-item">
              <button
                style="border: none"
                @click="showDialog = false"
                class="md-fab md-mini md-info"
              >
                <span class="material-icons"> close </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <form novalidate class="md-layout" @submit.prevent="saveEvent">
          <md-card class="md-layout-item md-size-100">
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-100">
                  <md-field :class="getValidationClass('title')">
                    <label for="title">Titulo</label>
                    <md-input
                      name="title"
                      id="title"
                      autocomplete="task title"
                      v-model="form.title"
                      :disabled="sending"
                    />
                    <span class="md-error" v-if="!$v.form.title.required"
                      >* dato requerido</span
                    >
                    <span class="md-error" v-else-if="!$v.form.title.minlength"
                      >* titulo es muy corto</span
                    >
                  </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                  <md-field :class="getValidationClass('description')">
                    <label for="description">Detalles (opcionales)</label>
                    <md-input
                      id="description"
                      name="description"
                      autocomplete="taskdescription"
                      v-model="form.description"
                      :disabled="sending"
                    />
                  </md-field>
                </div>
              </div>

              <md-checkbox v-model="form.allDay">Todo el dia</md-checkbox>
              <md-checkbox v-model="form.recurrentType" value="0"
                >Semanal</md-checkbox
              >
              <md-checkbox
                v-model="form.recurrentType"
                value="1"
                @change="nullMonthlyRepeat"
                >Mensual</md-checkbox
              >
              <md-checkbox v-model="form.recurrentType" value="2"
                >Anual</md-checkbox
              >
              <div v-if="form.recurrent" class="md-layout-item md-size-50">
                <md-field>
                  <label>Días</label>
                  <md-select v-model="form.daysOfWeek" multiple>
                    <md-option :value="1">Lunes</md-option>
                    <md-option :value="2">Martes</md-option>
                    <md-option :value="3">Miercoles</md-option>
                    <md-option :value="4">Jueves</md-option>
                    <md-option :value="5">Viernes</md-option>
                    <md-option :value="6">Sábado</md-option>
                    <md-option :value="0">Domingo</md-option>
                  </md-select>
                </md-field>
              </div>
              <div
                v-if="form.recurrentType == '1'"
                class="md-layout-item md-size-50"
              >
                <label>Repetir durante {{ form.monthlyRepeat }} meses</label>
                <md-field>
                  <md-select v-model="form.monthlyRepeat">
                    <md-option v-for="m in months" :key="m" :value="m">{{
                      m
                    }}</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100 md-size-50">
                  <md-datepicker
                    :class="getValidationClass('start')"
                    name="start"
                    id="start"
                    v-model="form.start"
                    :disabled="sending"
                    md-immediately
                  >
                    <label for="start">Inicia</label>
                    <span class="md-error" v-if="!$v.form.start.required"
                      >* dato requerido</span
                    >
                  </md-datepicker>
                </div>

                <div class="md-layout-item md-small-size-100 md-size-50">
                  <md-datepicker
                    :class="getValidationClass('end')"
                    name="end"
                    id="end"
                    v-model="form.end"
                    :disabled="sending"
                    md-immediately
                  >
                    <label for="end">Finaliza</label>
                    <span class="md-error" v-if="!$v.form.end.required"
                      >* dato requerido</span
                    >
                  </md-datepicker>
                </div>
              </div>

              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-40">
                  <label for="startTime" style="margin-right: 1rem">de</label>
                  <vue-timepicker
                    :disabled="form.allDay"
                    id="startTime"
                    name="startTime"
                    :minute-interval="15"
                    v-model="form.startTime"
                    close-on-complete
                  ></vue-timepicker>
                </div>
                <div class="md-layout-item md-size-40">
                  <label for="endTime" style="margin-right: 1rem">a</label>
                  <vue-timepicker
                    :disabled="form.allDay"
                    id="endTime"
                    name="endTime"
                    :minute-interval="15"
                    v-model="form.endTime"
                    close-on-complete
                  ></vue-timepicker>
                </div>
              </div>
              <md-field class="md-layout-item md-small-size-100">
                <input
                  type="file"
                  name="eventFiles"
                  ref="eventFiles"
                  id="eventFiles"
                  @change="uploadFile($event.target.files)"
                  multiple
                />
              </md-field>
              <div class="md-layout-item md-size-100">
                <md-chip
                  class="fileChip"
                  @md-delete="onChipDelete(item)"
                  @md-click="downloadFile(item)"
                  md-deletable
                  md-clickable
                  v-for="(item, index) in form.eventFiles"
                  :key="index"
                >
                  {{ item.originalname }}
                </md-chip>
              </div>
            </md-card-content>

            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <md-card-actions>
              <md-button
                @click="deleteEvent"
                class="md-danger"
                :disabled="sending"
                >Eliminar</md-button
              >

              <md-button type="submit" class="md-primary" :disabled="sending"
                >Guardar</md-button
              >
            </md-card-actions>
          </md-card>

          <md-snackbar :md-active.sync="userSaved"
            >El evento {{ form.title }} ha sido agregado al
            calendario!</md-snackbar
          >
        </form>
      </div>
    </md-dialog>

    <md-button class="md-info md-raised" @click="showDialog = true"
      >Agregar Evento</md-button
    >
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength,
} from "vuelidate/lib/validators";
import eventService from "../../services/Events/events.service";
import FileService from "../../services/Files/file.service";
import moment from "moment";
import VueTimepicker from "vue2-timepicker";
import eventsService from "../../services/Events/events.service";
import { mapActions, mapState } from "vuex";

export default {
  name: "edit-event-modal",
  components: { VueTimepicker },
  mixins: [validationMixin],
  props: {
    userData: null,
  },
  data() {
    return {
      modalTitle: "Agregar",
      showDialog: false,
      updateId: null,
      form: {
        daysOfWeek: [],
        allDay: false,
        title: null,
        start: null,
        end: null,
        description: null,
        recurrent: false,
        recurrentType: null, //(0 weekly - 1 monthly - 2 yearly)
        startRecur: null,
        endRecur: null,
        startTime: null,
        endTime: null,
        color: "blue",
        sharedId: null,
        monthlyRepeat: [],
      },
      uploaded: null,
      recurrent: false,
      userSaved: false,
      sending: false,
      lastUser: null,
      disableTime: false,
      months: [2, 3, 6, 12],
    };
  },
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(3),
      },
      start: {
        required,
      },
      end: {
        required,
      },
    },
  },
  methods: {
    async new(clickedDate) {
      this.showDialog = true;
      this.form.start = clickedDate;
      this.form.end = clickedDate;
    },
    async open(event) {
      this.showDialog = true;
      this.form.end = event.end;
      this.form.allDay = event.allDay;
      this.form.title = event.title;
      this.form.start = event.start;
      this.form.description = event.description;
      this.form.recurrent = event.startRecur != undefined ? true : false;
      this.form.startRecur = event.startRecur;
      this.form.endRecur = event.endRecur;
      this.form.startTime =
        event.startTime != undefined
          ? event.startTime
          : this.parseEditEventTime(event.start);
      this.form.endTime =
        event.endTime != undefined
          ? event.endTime
          : this.parseEditEventTime(event.end);
      this.form.eventFiles = event.eventFiles;
      // this.form.startTime = this.parseEditEventTime(event.start);
      // this.form.endTime = this.parseEditEventTime(event.end);
      this.form.color = event.color;
      this.modalTitle = "Actualizar";
      this.updateId = event.id;
      this.form.daysOfWeek = event.daysOfWeek;
      this.form.recurrentType = event.recurrentType;
      this.form.sharedId = event.sharedId;
    },
    nullRecurrentType() {
      if (this.form.recurrent) {
        this.form.recurrentType = null;
      }
    },
    parseEditEventTime(date) {
      let temp = new Date(date);
      let hours = temp.getHours().toString().padStart(2, "0");
      let minutes = temp.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.title = null;
      this.form.description = null;
      this.form.start = null;
      this.form.end = null;
      this.form.startRecur = null;
      this.form.endRecur = null;
    },
    saveEvent() {
      if (this.form.recurrent) {
        this.saveRecurrentEvent();
      } else {
        this.saveNormalEvent();
      }
    },
    async saveNormalEvent() {
      let normalEvent = this.parseEventObject();
      this.eventService(normalEvent);
    },
    async saveRecurrentEvent() {
      let recurrentEvent = this.parseEventObject();
      recurrentEvent.startRecur = recurrentEvent.start;
      recurrentEvent.endRecur = recurrentEvent.end;

      this.eventService(recurrentEvent);
    },
    async eventService(data) {
      let formData = new FormData();
      if (this.updateId) {
        data.id = this.updateId;

        for (const field in data) {
          formData.append(field, data[field]);
        }
        if (this.uploaded) {
          for (let i = 0; i < this.uploaded.length; i++) {
            formData.append("eventFiles", this.uploaded[i]);
          }
        }
        await eventsService.update(formData).then(() => {
          this.clearForm();
          this.showDialog = false;
          this.sending = false;
          this.$notify({
            message: "Evento Modificado",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "info",
          });
          location.reload();
        });
      } else {
        data.userId = this.userDB.userId;
        for (const field in data) {
          formData.append(field, data[field]);
        }
        if (this.uploaded) {
          for (let i = 0; i < this.uploaded.length; i++) {
            formData.append("eventFiles", this.uploaded[i]);
          }
        }
        await eventService.create(data).then(() => {
          this.clearForm();
          this.showDialog = false;
          this.sending = false;
          this.$notify({
            message: "Evento Agregado",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "info",
          });
        });
      }
    },
    parseEventObject() {
      if (
        this.form.start.getDate() != this.form.end.getDate() &&
        this.form.allDay
      ) {
        this.form.end.setSeconds(1);
        let eventData = JSON.parse(JSON.stringify(this.form));
        // eventData.startTime.delete;
        // event.endTime.delete;
        return eventData;
      }
      if (this.form.allDay) {
        let eventData = JSON.parse(JSON.stringify(this.form));

        return eventData;
      } else {
        let eventData = JSON.parse(JSON.stringify(this.form));
        eventData.startTime = `${eventData.startTime.HH}:${eventData.startTime.mm}`;
        eventData.endTime = `${eventData.endTime.HH}:${eventData.endTime.mm}`;
        return eventData;
      }
      // let eventData = JSON.parse(JSON.stringify(this.form));
      // if (this.recurrent) {
      //   eventData.startTime = `${eventData.startTime.HH}:${eventData.startTime.mm}`;
      //   eventData.endTime = `${eventData.endTime.HH}:${eventData.endTime.mm}`;
      // }

      // return eventData;
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
      alert("error");
    },
    uploadFile(files) {
      if (!files.length) {
        return;
      }

      this.uploaded = files;
    },
    onChipDelete(value) {
      const data = {
        id: this.updateId,
        path: value.path,
        filename: value.filename,
      };
      eventsService.deleteFile(data);
    },
    downloadFile(file) {
      FileService.downloadFile(file.path, file.originalname);
    },
    deleteEvent() {
      if (this.form.sharedId) {
        eventService.deleteRecurrent(this.form.sharedId).then(() => {
          this.showDialog = false;
          this.$notify({
            message: "Evento Recurrente Eliminado",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "info",
          });
        });
        return;
      }
      eventsService
        .delete(this.updateId)
        .then(() => {
          this.showDialog = false;
          this.$notify({
            message: "Evento Eliminado",
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "info",
          });
          location.reload();
        })
        .catch((error) => {});
    },
    updateEndDate(value) {
      let start = this.form.start.getMonth();
      let newEnd = new Date(this.form.start.toString());
      newEnd.setMonth(start + value);
      this.form.end = newEnd;
    },
    endDateMatchStart() {
      this.form.end = this.form.start;
    },
    nullMonthlyRepeat(value) {
      if (value == null) {
        this.form.monthlyRepeat = null;
      }
    },
  },
  filters: {
    moment: function (date) {
      return moment(date).format("YYYY-MM-DD");
    },
  },
  created() {},
  computed: {
    ...mapState(["userDB"]),
  },
  watch: {
    "form.recurrentType": function (newValue, oldValue) {
      switch (newValue) {
        case "0":
          this.form.recurrent = true;
          break;
        case "1":
          this.form.recurrent = false;
          this.form.end = this.form.start;
          break;
        case "2":
          this.form.recurrent = false;
          this.form.allDay = true;
          break;
        default:
          this.form.recurrent = false;
          if (oldValue == 2) {
            this.form.allDay = false;
          }
          break;
      }
    },
    "form.monthlyRepeat": function (newValue, oldValue) {
      if (newValue != null) {
        this.updateEndDate(newValue);
      } else if (oldValue != null && newValue == null) {
        this.endDateMatchStart();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

label {
  color: black;
}
.fileChip {
  font-size: 0.75rem;
}

#eventModal {
  padding: 0.5rem;
  min-height: 625px;
  min-width: 600px;
}
</style>
