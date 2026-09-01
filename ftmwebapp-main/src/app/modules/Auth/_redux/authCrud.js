import axios from "axios";

export const LOGIN_URL = process.env.REACT_APP_API_URL + "auth/login-superadmin";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";
export const ME_URL = process.env.REACT_APP_API_URL + "profile";

export function login(email, password) {
  return axios.post(LOGIN_URL, { 'username' : email, 'password': password });
}

export function register(email, fullname, username, role, password) {                     //adding role
  return axios.post(REGISTER_URL, { email, fullname, role, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

// export function getUserByToken() {
//   // Authorization head should be fulfilled in interceptor.
//   return axios.get(ME_URL);
// }

export async function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  try {
    const response = await axios.get(ME_URL);
    // Assuming the 'role' is included in the response data
    return response.data;
  } catch (error) {
    // Handle any errors here
    console.error("Error getting user by token:", error);
    throw error; // Re-throw the error to handle it in the saga
  }
}

