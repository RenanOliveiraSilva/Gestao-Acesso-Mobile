import axios from "axios"; // Importe o axios para verificar o tipo de erro
import { Rota } from "../assets/types/linhas";
import { api, createAuthHeaders } from "../utils/api";
import { showToastTop } from "../utils/showToast";

export const getUserRoutes = async (): Promise<Rota[] | null> => {
  try {
    const headers = await createAuthHeaders();
    const response = await api.get("rotas", { headers });

    if (response.status === 200) {
      console.log(response.data as Rota[]);
      return response.data as Rota[];
    }

    showToastTop("error", "Erro ao buscar as Linhas.");
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 403) {
        const detailMessage =
          error.response.data?.detail || "Autenticação inválida.";
        showToastTop("error", detailMessage);
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
