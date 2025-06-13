import axios from "axios";

const BASE_URL = "http://127.0.0.1:5001"; // API port

export async function registerUser(formData) {
  return axios.post(`${BASE_URL}/auth/register`, formData);
}

// Servicio de login
export async function loginUser({ email, password }) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return { success: true, user: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al iniciar sesión",
    };
  }
}
