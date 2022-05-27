import axios from "axios";

export const getTokens = () => {
  const accessToken = localStorage.getItem("token");
  return {
    accessToken,
  };
};

const ApiUrl = process.env.REACT_APP_API_URL;

// Create Instance For Api Call.
const AxiosInstance = axios.create({
  baseURL: `${ApiUrl}/api/`,
});

const token = getTokens();
if (token) {
  AxiosInstance.defaults.headers.common["Authorization"] = token;
}

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return new Promise(async (_, reject) => {
      if (err.response && err.response.status === 401) {
        // Handle Unauthorized
      }
      reject(err);
    });
  }
);

export default AxiosInstance;
