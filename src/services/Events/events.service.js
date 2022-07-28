const axios = require("axios");
const baseURL = process.env.VUE_APP_BASE_URL;
const serverUrl = `/events`;

const token = localStorage.getItem("token");

const config = {
  headers: { Authorization: `Bearer ${token}` },
};
export default {
  async create(data) {
    return await axios.post(serverUrl, data, config).then(response => {
      if (response.data.errors) {
        response;
      }
    });
  },
  async getAll(userId) {
    return await axios
      .get(`${serverUrl}/${userId}`, config)
      .then(response => response.data)
      .catch(error => error);
  },
  async paginatedList(limit, skip, userId) {
    return await axios
      .get(`${serverUrl}/list/${userId}?limit=${limit}&skip=${skip}`)
      .then(response => response.data)
      .catch(error => console.error(error));
  },
  async getById(id) {
    return axios
      .get(`${serverUrl}/${id}`, config)
      .then(response => response.data)
      .catch(error => error);
  },
  async update(data) {
    return axios
      .put(serverUrl, data, config)
      .then(response => response.data)
      .catch(error => error);
  },
  async delete(id) {
    return axios
      .delete(`${serverUrl}/${id}`, config)
      .then(response => response)
      .catch(error => error);
  },
  async deleteFile(data) {
    return axios
      .put(`${serverUrl}/deletefile`, data, config)
      .catch(error => {});
  },
  async deleteRecurrent(sharedId) {
    return axios
      .delete(`${serverUrl}/recurrent/${sharedId}`, config)
      .then(res => {
        return res;
      })
      .catch(err => {
        console.error(err);
        return err;
      });
  },
};

function parseFormData(data) {
  let formData = new FormData();

  for (const field in data) {
    field, data[field];
    formData.append(field, data[field]);
  }

  return formData;
}
