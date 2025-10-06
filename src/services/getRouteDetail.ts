import axios from "axios"; // Importe o axios para verificar o tipo de erro
import { Ponto } from "../assets/types/linhas";
import { api, createAuthHeaders } from "../utils/api";
import { showToastTop } from "../utils/showToast";

export const getRouteDatail = async (id: number): Promise<Ponto[] | null> => {
  try {
    const headers = await createAuthHeaders();
    const response = await api.get(`rotas/${id}/trajeto`, { headers });

    if (response.status === 200) {
      return response.data as Ponto[];
    }

    showToastTop("error", "Erro ao buscar as Pontos.");
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 403) {
        const detailMessage =
          error.response.data?.detail || "Falha ao Buscar detalhes da Rota.";
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
