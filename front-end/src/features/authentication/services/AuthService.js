import axios from "axios";

import  { PORTS } from "../../../shared/utils/Ports";

const BASE_URL = PORTS.AUTH.BASE_URL; 

export async function registerUser(formData) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, formData);
    return { success: true, user: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Error al registrar usuario",
    };
  }
}

export async function loginUser({ email, password, recaptcha }) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password, recaptcha });
    // if (!response.data.token) {
    //   throw new Error('No se recibió el token de autenticación');
    // }
    return { 
      success: true, 
      res: response.data
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Error al iniciar sesión",
    };
  }
}

export async function getUserById(farmerId) {
  try {
    const response = await axios.get(`${BASE_URL}/auth/users/${farmerId}`);
    return { success: true, farmer: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Error al obtener datos del agricultor",
    };
  }
}
