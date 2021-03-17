import axios from "axios";

export const defaultHeaders = {
  accept: "*/*",
  "Content-Type": "application/json",
};

function init() {
  axios.defaults.headers = defaultHeaders;
  axios.defaults.baseURL = process.env.REACT_APP_ENDPOINT as string;
}

export default init;
