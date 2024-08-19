import axios from "axios";
import lien from "./lien";

const api = axios.create({
  baseURL: lien,
  timeout: 1000000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error) {
      console.log(error);
    }
    return Promise.reject(error);
  }
);
export default api;
