import StorageKeys from '../constants/storage-key.js';
const { default: axios } = require("axios");

const axiosClient = axios.create({
  baseURL: 'http://lovedatingfriends.xyz/api',
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
// axiosClient.interceptors.request.use(
  
//   function (config) {
//     // Do something before request is sent
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );
axiosClient.interceptors.request.use(async (config) => {
  const customHeaders = {};

  const accessToken = localStorage.getItem(StorageKeys.ACCESS_TOKEN);
  if (accessToken) {
    customHeaders.Authorization = `Bearer ${accessToken}`;
  }

  return {
    ...config,
    headers: {
      ...customHeaders,  // auto attach token
      ...config.headers, // but you can override for some requests
    }
  };
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
   
    
    // const { config, status, data } = error.response;
    // const URLS = ['/auth/local/register', '/auth/local'];
    // if (URLS.includes(config.url) && status === 400) {
    //   const errorList = data.data || [];
    //   const firstError = errorList.length > 0 ? errorList[0] : {};
    //   const messageList = firstError.messages || [];
    //   const firstMessage = messageList.length > 0 ? messageList[0] : {};
    //   throw new Error(firstMessage.message);
    
    // }

    return Promise.reject(error.response.data);
  }
);

export default axiosClient;
