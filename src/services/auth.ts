import axios from "axios"; // Importe o axios para verificar o tipo de erro
import { LoginResponse } from "../assets/types/responseTypes";
import { api } from "../utils/api";
import { showToastTop } from "../utils/showToast";
import { UserStorage } from "../utils/userStorage";

export const autenticateUser = async (
  matricula: string,
  senha: string
): Promise<boolean> => {
  if (!matricula || !senha) {
    showToastTop("info", "Matrícula e senha são obrigatórios.");
    return false;
  }

  try {
    const response = await api.post("auth/login", {
      username: matricula,
      senha,
    });

    if (response.status === 200) {
      showToastTop("success", "Login efetuado com sucesso!");
      await UserStorage.saveUserData(response.data as LoginResponse);
      return true;
    }

    return false;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        const detailMessage =
          error.response.data?.detail || "Usuário ou senha inválidos.";
        showToastTop("error", detailMessage);
      } else {
        console.log(error);
        showToastTop(
          "error",
          "Não foi possível conectar ao servidor. Tente novamente."
        );
      }
    } else {
      showToastTop("error", "Ocorreu um erro desconhecido.");
      console.error(error);
    }

    return false;
  }
};
