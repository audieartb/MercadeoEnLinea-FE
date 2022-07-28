const axios = require("axios");
const serverUrl = "/file";
const token = localStorage.getItem("token");
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export default {
  async downloadFile(path, originalname) {
    const data = {
      path: path,
    };
    const resp = await axios({
      url: serverUrl,
      method: "POST",
      responseType: "blob",
      data: data,
    });

    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", originalname);
    document.body.appendChild(link);
    link.click();
  },

  async deleteFile(path) {
    const data = {
      path: path,
    };
    return await axios.post(`${serverUrl}/delete`, data, config);
  },
};
