const axios = require("axios");
const serverUrl = `/users`;
const token = localStorage.getItem("token");
const config = {
  headers: { Authorization: `Bearer ${token}` },
};
export default {
  async deleteUsers(Id) {
    return axios
      .delete(`${serverUrl}/${Id}`, config)
      .then(response => response.data)
      .catch(error => {
        alert(error);
      });
  },
  async createUser(data) {
    return axios
      .post(serverUrl, data, config)
      .then(response => {
        response;
      })
      .catch(error => {
        error;
      });
  },
  async updateUser(data) {
    return axios
      .put(`${serverUrl}/${data.id}`, data, config)
      .then(response => {})
      .catch(error => {
        error.message;
      });
  },
  async getAllUsers() {
    return axios
      .get(serverUrl, config)
      .then(response => response.data)
      .catch(error => error);
  },
  async getUserById(userId) {
    return axios
      .get(`${serverUrl}/${userId}`, config)
      .then(response => response.data)
      .catch(error => error);
  },

  async resetPassword(userId) {
    return axios
      .put(`${serverUrl}/passwordreset/${userId}`, config)
      .then(res => {
        res;
      })
      .catch(error => {
        error;
      });
  },

  async reset(email) {
    let data = {
      email: email,
    };

    return axios
      .post(`${serverUrl}/resetpassword`, data, config)
      .then(data => {
        return data.data.message
      })
      .catch(error => {
        console.error(error);
      });
  },
  async uploadpic(formdata) {
    return axios
      .post(`${serverUrl}/profilepic`, formdata, config)
      .then(response => response.data)
      .catch(error => error);
  },
};
