// src/services/userStorage.ts
import * as SecureStore from "expo-secure-store";
import { LoginResponse } from "../assets/types/responseTypes";

const STORAGE_KEYS = {
  idColaborador: "userId",
  nome: "userNome",
  token: "userToken",
  email: "userEmail",
  role: "userRole",
} as const;

export const UserStorage = {
  // Salvar dados do usuário
  async saveUserData(userData: LoginResponse) {
    await Promise.all([
      SecureStore.setItemAsync(
        STORAGE_KEYS.idColaborador,
        userData.idColaborador
      ),
      SecureStore.setItemAsync(STORAGE_KEYS.nome, userData.nome),
      SecureStore.setItemAsync(STORAGE_KEYS.token, userData.token),
      SecureStore.setItemAsync(STORAGE_KEYS.email, userData.email),
      SecureStore.setItemAsync(STORAGE_KEYS.role, userData.role),
    ]);
  },

  // Recuperar token
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(STORAGE_KEYS.token);
  },

  // Recuperar todos os dados
  async getUserData() {
    const [idColaborador, nome, token, email, role] = await Promise.all([
      SecureStore.getItemAsync(STORAGE_KEYS.idColaborador),
      SecureStore.getItemAsync(STORAGE_KEYS.nome),
      SecureStore.getItemAsync(STORAGE_KEYS.token),
      SecureStore.getItemAsync(STORAGE_KEYS.email),
      SecureStore.getItemAsync(STORAGE_KEYS.role),
    ]);

    return { idColaborador, nome, token, email, role };
  },

  // Limpar dados (logout)
  async clearUserData() {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.idColaborador),
      SecureStore.deleteItemAsync(STORAGE_KEYS.nome),
      SecureStore.deleteItemAsync(STORAGE_KEYS.token),
      SecureStore.deleteItemAsync(STORAGE_KEYS.email),
      SecureStore.deleteItemAsync(STORAGE_KEYS.role),
    ]);
  },

  // Verificar se usuário está logado
  async isLoggedIn(): Promise<boolean> {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.token);
    return Boolean(token);
  },
};
