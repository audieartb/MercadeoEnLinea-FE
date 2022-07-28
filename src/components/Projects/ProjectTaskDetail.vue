<template>
  <div>
    <md-dialog :md-active.sync="showDialog" class="detail-modal">
      <md-dialog-title>
        <div class="md-layout">
          <span class="md-layout-item md-size-100"
            >{{ project }} - {{ title }}</span
          >
          <div class="md-alignment-top-right"></div>
        </div>
      </md-dialog-title>
      <md-dialog-content>
        <div>{{ user }}</div>
        <div>{{ description }}</div>
        <div v-for="comment in comments" :key="comment.date">
          <md-card>
            <div class="w-100" id="comment-name">
              {{ comment.author }}
            </div>

            <md-card-content>
              {{ comment.comment }}
            </md-card-content>
            <md-card-actions>
              {{ comment.date | filterdate}}
            </md-card-actions>
          </md-card>
        </div>
        <div>
          <md-card>
            <textarea
              v-model="newCommentText"
              placeholder="Añade un comentario"
              rows="3"
              style="width: 100%"
            ></textarea>
            <md-card-actions>
              <md-button @click="saveComment">Agregar</md-button>
            </md-card-actions>
          </md-card>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-danger" @click="deleteTask"
          >Eliminar</md-button
        >
        <md-button class="md-info" @click="showDialog = false"
          >Cerrar</md-button
        >
      </md-dialog-actions>
    </md-dialog>

    <md-button @click="showDialog = true"><span class="material-icons">
launch
</span></md-button>
  </div>
</template>

<script>
import CommentService from "../../services/Projects/comments.service";
import moment from 'moment'
import { mapState } from 'vuex';

export default {
  name: "project-task-details",
  props: {
    project: String,
    title: String,
    description: String,
    user: String,
    projectId: Number,
    taskId: Number,
    status: String
  },
  data: () => ({
    showDialog: false,
    newCommentText: "",
    comment: {
      date: Date.now(),
      author: "",
      comment: ""
    },
    comments: [
      {
        date: "02-04-2020",
        author: "Rodrigo Perez",
        comment: "Documentación en proceso"
      },
     
    ],
    test: null
  }),
  methods: {
    saveComment() {
      if (!this.newCommentText) {
        return;
      }

      this.comment.comment = this.newCommentText;
      this.comment.author = this.userDB.name
      this.comments.push(this.comment);
      CommentService.saveComment("projectId", "taskId", "comment");
      this.clearNewComment();
    },
    clearNewComment() {
      this.newCommentText = "";
    },
    async getComents() {
      this.test = await CommentService.getComments(1);
    
    },
    deleteTask(){
      
    }
  },
  mounted() {
    this.getComents();
  },
  filters: {
    filterdate: function (date) {
      if (!date) return "";
      return moment(date).format("DD-MM-YYYY");
    },
  },
  computed:{
    ...mapState(["userDB"])
  }
};
</script>

<style>
.detail-modal {
  width: 500px;
}

#comment-name {
  padding-left: 1rem;
  background-color: rgb(72, 129, 179);
}
</style>