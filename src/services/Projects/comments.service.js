const axios = require('axios');


export default {
    async saveComment(projectId, taskId, comment){
        
        var data = {
            "projectId": projectId,
            "taskId": taskId,
            "comment":comment
        }

        let res = await axios.post("url", data)
        .then((response)=>{
            return response.data;
        },(error)=>{
            alert( error);
        });

    },
    async getComments(projectId){

        let res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${projectId}`).then((response)=> response.data);
        
        return res;
    
    },
    async deleteComment(data){
      
        let res = await axios.delete(`https://jsonplaceholder.typicode.com/todos/${projectId}`,  headers).then(response => response.data);

        return res;
    },
    async updateComment(data){
        
    }

};
