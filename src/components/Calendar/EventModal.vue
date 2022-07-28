<template>
  <div>
    <md-dialog :md-active.sync="showDialog" id="eventModal">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-50">
          <md-dialog-title>Agregar Evento</md-dialog-title>
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
        <form novalidate class="md-layout" @submit.prevent="validateEvent">
          <md-card class="md-layout-item md-size-100">
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100 md-size-50">
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

              <div class="md-layout-item md-size-100">
                <md-field :class="getValidationClass('description')">
                  <label for="description">Descripción</label>
                  <md-input
                    id="description"
                    name="description"
                    autocomplete="taskdescription"
                    v-model="form.description"
                    :disabled="sending"
                  />
                  <span class="md-error" v-if="!$v.form.description.required"
                    >se requiere descripción</span
                  >
                  <span
                    class="md-error"
                    v-else-if="!$v.form.description.maxlength"
                    >descripción invalida</span
                  >
                </md-field>
              </div>
              <md-field class="md-layout-item md-size-100">
                <input
                  type="file"
                  name="eventFiles"
                  ref="eventFiles"
                  id="eventFiles"
                  @change="uploadFile($event.target.files)"
                  multiple
                />
              </md-field>

              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50 md-small-size-100">
                  <label for="startTime" class="time-label">Inicia</label>
                  <vue-timepicker
                    :disabled="form.allDay"
                    id="startTime"
                    name="startTime"
                    :minute-interval="15"
                    v-model="form.startTime"
                    close-on-complete
                  ></vue-timepicker>
                </div>
                <div class="md-layout-item md-size-50 md-small-size-100">
                  <label for="endTime" class="time-label">Finaliza</label>
                  <vue-timepicker
                    :disabled="form.allDay"
                    id="endTime"
                    name="endTime"
                    :minute-interval="15"
                    v-model="form.endTime"
                    close-on-complete
                  ></vue-timepicker>
                </div>
                <md-checkbox v-model="form.allDay">Todo el dia</md-checkbox>
                <md-checkbox v-model="recurrent">Recurrente</md-checkbox>
              </div>
              <div class="md-layout md-gutter">
                <md-field
                  class="
                    md-layout-item md-size-50 md-small-size-100
                    day-selector
                  "
                  v-if="recurrent"
                >
                  <label>Días </label>
                  <md-select
                    v-model="form.daysOfWeek"
                    name="days"
                    id="days"
                    multiple
                  >
                    <md-option
                      v-for="item in days"
                      v-bind:key="item.id"
                      :value="item.id"
                    >
                      {{ item.day }}
                    </md-option>
                  </md-select>
                </md-field>
                <md-field class="md-layout-item md-size-50 md-small-size-100">
                  <label>Color </label>
                  <md-select v-model="form.color" name="color" id="color">
                    <md-option
                      v-for="item in colors"
                      v-bind:key="item.id"
                      :value="item.hex"
                    >
                      {{ item.color }}
                    </md-option>
                  </md-select>
                </md-field>
              </div>
            </md-card-content>

            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <md-card-actions>
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import eventService from "../../services/Events/events.service";
import VueTimepicker from "vue2-timepicker";
import { mapActions, mapState } from "vuex";
import moment from "moment";
export default {
  name: "DialogCustom",
  components: { VueTimepicker },
  mixins: [validationMixin],
  data() {
    return {
      showDialog: false,
      form: {
        daysOfWeek: [],
        allDay: false,
        title: null,
        start: null,
        end: null,
        description: null,
        //recurrent: false,
        startRecur: null,
        endRecur: null,
        startTime: null,
        endTime: null,
        color: null,
        monthly: null,
      },
      uploaded: null,
      recurrent: false,
      userSaved: false,
      sending: false,
      lastUser: null,
      disableTime: false,
      days: [
        { day: "Domingo", id: 0 },
        { day: "Lunes", id: 1 },
        { day: "Martes", id: 2 },
        { day: "Miércoles", id: 3 },
        { day: "Jueves", id: 4 },
        { day: "Viernes", id: 5 },
        { day: "Sábado", id: 6 },
      ],
      colors: [
        { color: "rojo", hex: "#FF0000" },
        { color: "azul", hex: "#0068FF" },
        { color: "verde", hex: "#00FF46" },
        { color: "amarillo", hex: "#F7FF00" },
      ],
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
      description: {
        required,
        minLength: minLength(3),
      },
    },
  },
  methods: {
    uploadFile(files) {
      if (!files.length) {
        return;
      }
      this.uploaded = files;
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    async openNew(startDate) {
      this.showDialog = true;
      this.form.start = startDate;
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
      this.form.userId = this.userDB.userId;
      if (this.recurrent) {
        this.saveRecurrentEvent();
      } else {
        this.saveNormalEvent();
      }
    },
    async saveNormalEvent() {
      let normalEvent = this.parseEventObject();

      let formData = new FormData();
      for (const field in normalEvent) {
        formData.append(field, normalEvent[field]);
      }
      if (this.uploaded) {
        for (let i = 0; i < this.uploaded.length; i++) {
          formData.append("eventFiles", this.uploaded[i]);
        }
      }

      await eventService.create(formData).then(() => {
        this.clearForm();
        this.showDialog = false;
        this.sending = false;
        this.$notify({
          message: "Evento Agregrado",
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "info",
        });
        location.reload();
      });
    },
    async saveRecurrentEvent() {
      let recurrentEvent = this.parseEventObject();
      recurrentEvent.startRecur = recurrentEvent.start;
      recurrentEvent.endRecur = recurrentEvent.end;

      let formData = new FormData();
      for (const field in recurrentEvent) {
        formData.append(field, recurrentEvent[field]);
      }
      if (this.uploaded) {
        for (let i = 0; i < this.uploaded.length; i++) {
          formData.append("eventFiles", this.uploaded[i]);
        }
      }

      await eventService.create(formData).then(() => {
        this.clearForm();
        this.showDialog = false;
        this.sending = false;
        this.$notify({
          message: "Evento Agregrado",
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "info",
        });
      });
    },
    parseEventObject() {
      if (
        this.form.start.getDate() != this.form.end.getDate() &&
        this.form.allDay
      ) {
        this.form.end.setSeconds(1);
        let eventData = JSON.parse(JSON.stringify(this.form));
        return eventData;
      }
      if (this.form.allDay) {
        return JSON.parse(JSON.stringify(this.form));
      } else {
       
        let eventData = JSON.parse(JSON.stringify(this.form));
        eventData.startTime = `${eventData.startTime.HH}:${eventData.startTime.mm}`;
        eventData.endTime = `${eventData.endTime.HH}:${eventData.endTime.mm}`;
        return eventData;
      }
    },
    validateEvent() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveEvent();
        return;
      }
      this.$notify({
        message: "Datos invalidos",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger",
      });
    },
  },
  filters: {},
  computed: {
    ...mapState(["userDB"]),
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

.day-selector {
  margin-right: 1rem;
}

.time-label {
  margin-right: 1rem;
}
</style>
