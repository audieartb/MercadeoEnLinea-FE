const axios = require("axios");
const serverUrl = `/projects`;
export default {
  async delete(id) {
    let res = await axios
      .delete(`${serverUrl}/${id}`)
      .then(response => response.data);
    return res;
  },
  async create(data) {
    let res = await axios
      .post(`${serverUrl}`, data)
      .then(response => response.data);
    return res;
  },
  async update(data) {
    return await axios
      .put(`${serverUrl}/${data.projectId}`, data)
      .then(response => response)
      .catch(error => error);
  },
  async getById(id) {
    return await axios
      .get(`${serverUrl}/id/${id}`)
      .then(response => {
        return response;
      })
      .catch(err => {
        alert(err);
        return err;
      });
  },
  async getAll(id) {
    return await axios
      .get(`${serverUrl}/${id}`)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return err;
      });
  },
};
