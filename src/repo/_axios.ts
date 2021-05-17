import axios from "axios";

export const defaultHeaders = {
  accept: "*/*",
  "Content-Type": "application/json",
};

function init() {
  axios.defaults.headers = defaultHeaders;
  axios.defaults.baseURL = process.env.REACT_APP_ENDPOINT as string;
}

function handleAxiosExceptionCatch(thrown: any) {
  if (axios.isCancel(thrown)) {
    console.warn("Request canceled", thrown.message);
  } else {
    console.error(thrown.message);
  }
  return null;
}

export { handleAxiosExceptionCatch };

export default init;
