import axios from "axios";

const BASE_URL = "http://127.0.0.1:5001"; // API port

export async function registerUser(formData) {
  return axios.post(`${BASE_URL}/auth/register`, formData);
}
