const axios = require("axios");
const serverUrl = `/tasks`;
const token = localStorage.getItem("token");
const config = {
  headers: { Authorization: `Bearer ${token}` },
};

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "multipart/form-data",
};

export default {
  async create(data) {
    let res = axios
      .post(`${serverUrl}`, data, { headers })
      .then(response => response.data)
      .catch(error => alert(error));
    return res;
  },
  async delete(taskId) {
    let res = axios
      .delete(`${serverUrl}/${taskId}`, config)
      .then(response => response.data);
    return res;
  },
  async update(data) {
    let res = axios
      .put(`${serverUrl}`, data, { headers })
      .then(response => response.data)
      .catch(error => alert(error));

    return res;
  },
  async updateStatus(data) {
    data;
    let res = axios
      .put(`${serverUrl}/status`, data, config)
      .then(response => response.data)
      .catch(error => alert(error));

    return res;
  },

  async getTasks(projectId) {
    let res = axios
      .get(`${serverUrl}/byproject/${projectId}`, config)
      .then(response => response.data);

    return res;
  },

  async countTasks(projectId) {
    let res = axios
      .get(`${serverUrl}/count/${projectId}`, config)
      .then(response => {
        return response.data.count
      });

    return res;
  },

  async deleteFile(item) {
    return await axios
      .put(`${serverUrl}/deleteFile`, item, config)
      .then((res) => res)
      .catch(error => {
      });
  },
};
