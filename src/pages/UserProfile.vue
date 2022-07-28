<template>
  <div class="content">
    <div class="md-layout md-alignment-center-center">
       <div class="md-layout-item md-size-90">
        <user-card> </user-card>
      </div>
      <div class="md-layout-item md-size-66">
        <edit-profile-form data-background-color="blue"> </edit-profile-form>
      </div>
     
    </div>
  </div>
</template>

<script>
import { EditProfileForm, UserCard } from "@/pages";

export default {
  components: {
    EditProfileForm,
    UserCard
  }
};
</script>
