import axios from "axios";
import { UserStorage } from "./userStorage";

export const api = axios.create({
  baseURL: "https://backend-gestao-acesso-sha.onrender.com/",
});

// Helper para criar headers com token
export const createAuthHeaders = async () => {
  const token = await UserStorage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
