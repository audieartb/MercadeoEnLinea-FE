const axios = require("axios");
const url = "/api/auth";

export default {
  async login(data) {
    let res = await axios.post(url, data).then(response => {
      return response.data;
    });
    return res;
  },
};
