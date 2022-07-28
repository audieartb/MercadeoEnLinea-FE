const axios = require("axios");
const token = localStorage.getItem("token");
const config = {
  headers: { Authorization: `Bearer ${token}` },
};
const serverUrl = "/notifications";
export default {
  async getNotifications(Id) {
    let res = await axios
      .get(`${serverUrl}`, config)
      .then(response => response.data);
    return res;
  },
};
