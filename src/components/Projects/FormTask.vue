<template>
  <div>
    
  </div>
</template>

<script>
import {mapState} from 'vuex';
import TaskService from '../../services/Projects/tasks.service';
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  name: "FormTask",
  props:{
    projectId: String
  },
  mixins: [validationMixin],
  data: () => ({
    form: {
      title: null,
      description: null,
      status: null,
      userId: null,
      projectId: null,
      comments: null
    },
    userSaved: false,
    sending: false,
    lastUser: null
  }),
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(3)
      },
      description: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.title = null;
      this.form.description = null;
      this.form.status = null;
    },
    saveUser() {
      this.sending = true;
      this.form.userId = this.userDB.userId;
      this.form.projectId = this.projectId;

      // Instead of this timeout, here you can call your API
     this.$emit("formToModal", this.form);
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    }
  },
  computed:{
    ...mapState(['userDB'])
  }
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>