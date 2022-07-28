<template>
  <div>
    <div v-for="card in 5" :key="card" class="card project-card">
      <img
        class="card-img-top img-fluid"
        src="../../assets/img/project-card-default.jpg"
        alt="Card image cap"
      />
      <div class="card-body">
        <span class="card-title">Project Name</span>
        <p class="card-text">
          This is the card content, it tells you about the proyect. Click the
          button if you want to know more.
        </p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Pending Tasks: 8</li>
        <li class="list-group-item">Due Date: 05/05/2021</li>
      </ul>
      <div
        class="card-body card-body-bottom md-layout md-alignment-center-right md-size-100"
      >
        <a href="#" class="card-link md-layout-item md-size-100">
          Go to project <span class="material-icons"> chevron_right </span></a
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dashboard-project-card",
  props:{
    projectName: String,
    description: String,
    pendingTasks: Number,
    dueDate: String
  },
  data(){
    return{
      projects:[]
    }
  },
  methods:{
  
  },
  created(){
   
  },
  computed:{
    
  }
}
</script>

<style>
</style>