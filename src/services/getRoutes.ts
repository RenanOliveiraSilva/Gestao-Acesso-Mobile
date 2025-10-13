import axios from "axios";
import { Rota } from "../assets/types/linhas";
import { api } from "../utils/api";
import { showToastTop } from "../utils/showToast";

export const getUserRoutes = async (): Promise<Rota[] | null> => {
  try {
    const { data, status } = await api.get<Rota[]>("rotas");
    if (status === 200) return data;
    showToastTop("error", "Erro ao buscar as Linhas.");
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        const detail = error.response.data?.detail || "Autenticação inválida.";
        showToastTop("error", detail);
      } else {
        showToastTop(
          "error",
          "Não foi possível conectar ao servidor. Tente novamente."
        );
      }
    } else {
      showToastTop("error", "Ocorreu um erro desconhecido.");
      console.error(error);
    }
    return null;
  }
};
