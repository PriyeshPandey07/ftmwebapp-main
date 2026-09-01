import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
const userData = localStorage.getItem('persist:v706-demo1-auth');
let authToken = '';

console.log('userData', userData);
if (userData !== undefined && userData !== null && userData !== '') {
  const user = JSON.parse(userData);
  if (user !== undefined && user !== null && user !== '' && user.authToken !== undefined && user.authToken !== null && user.authToken !== '') {
    authToken = user.authToken.replace(/['"]+/g, '');
}
}

let api = axios.create({
  baseURL: BASE_URL,
});

if (authToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
}

export const get = async (endpoint, query) => {
  try {
    if (api.defaults.headers.common['Authorization'] == undefined || api.defaults.headers.common["Authorization"] == null) {
      let token = localStorage.getItem('loginToken');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.get(endpoint, query);
    return response.data;
  } catch (error) {
    // Handle error or throw an error
    throw new Error('Failed to fetch data');
  }
};

export const post = async (endpoint, data) => {
  try {
      if (api.defaults.headers.common['Authorization'] == undefined || api.defaults.headers.common["Authorization"] == null) {
        let token = localStorage.getItem('loginToken');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    // Handle error or throw an error
    throw new Error('Failed to post data');
  }
};

export const put = async (endpoint, data) => {
  if (api.defaults.headers.common['Authorization'] == undefined || api.defaults.headers.common["Authorization"] == null) {
    let token = localStorage.getItem('loginToken');
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    // Handle error or throw an error
    throw new Error('Failed to put data');
  }
};

export const deleteApi = async (endpoint) => {
  if (api.defaults.headers.common['Authorization'] == undefined || api.defaults.headers.common["Authorization"] == null) {
    let token = localStorage.getItem('loginToken');
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  try {
    const response = await api.delete(endpoint);
    return response;
  } catch (error) {
    // Handle error or throw an error
    throw new Error('Failed to put data');
  }
};