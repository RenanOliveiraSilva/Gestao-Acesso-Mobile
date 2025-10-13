// getRouteDetail.ts
import axios from "axios";
import type { Ponto, Rota, RotaInfo } from "../assets/types/linhas";
import { api } from "../utils/api";
import { showToastTop } from "../utils/showToast";

type RotaDetalhe = { info: RotaInfo; pontos: Ponto[] };

export const getRouteDetail = async (
  id: string
): Promise<RotaDetalhe | null> => {
  try {
    const { data, status } = await api.get<Rota>(`rotas/${id}`);
    if (status !== 200) {
      showToastTop("error", "Erro ao buscar os pontos da rota.");
      return null;
    }
    const { pontos, ...info } = data;
    return { info, pontos };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        const msg =
          (error.response.data as any)?.detail ||
          "Falha ao buscar detalhes da rota.";
        showToastTop("error", msg);
      } else if (error.response?.status === 404) {
        showToastTop("error", "Rota não encontrada.");
      } else {
        showToastTop(
          "error",
          "Não foi possível conectar ao servidor. Tente novamente."
        );
      }
    } else {
      console.error(error);
      showToastTop("error", "Ocorreu um erro desconhecido.");
    }
    return null;
  }
};
