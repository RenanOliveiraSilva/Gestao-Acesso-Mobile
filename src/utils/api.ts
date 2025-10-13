// src/utils/api.ts
import axios from "axios";
import { UserStorage } from "./userStorage";

export const api = axios.create({
  baseURL: "https://backend-gestao-acesso-sha.onrender.com/",
});

// Evita instalar interceptors múltiplas vezes em hot-reload
if (!(api as any)._interceptorsInstalled) {
  api.interceptors.request.use(async (config) => {
    const token = await UserStorage.getToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      // opcional: trate 401/403 globalmente aqui
      return Promise.reject(err);
    }
  );

  (api as any)._interceptorsInstalled = true;
}
