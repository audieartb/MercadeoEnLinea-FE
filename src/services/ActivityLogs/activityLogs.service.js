const axios = require("axios");
const serverUrl = "activitylog";
const token = localStorage.getItem("token");
const config = {
  headers: { Authorization: `Bearer ${token}` },
};

export default {
  async getAll() {
    if (token) {
      return await axios.get(serverUrl, config).then(response => response.data);
    }
  },
};
