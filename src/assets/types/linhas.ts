export interface Rota {
  idRota: number;
  idCidade: number;
  cidadeNome: string;
  cidadeUf: string;
  nome: string;
  periodo: string;
  capacidade: number;
  ativo: boolean;
  horaPartida: string;
  horaChegada: string;
  pontos: Ponto[];
}

export interface PontoDetalhe {
  idRota: number;
  idCidade: number;
  cidadeNome: string;
  cidadeUf: string;
  nome: string;
  periodo: string;
  capacidade: number;
  ativo: boolean;
  horaPartida: string;
  horaChegada: string;
  pontos: Ponto[];
}

export interface Ponto {
  ordem: number;
  idPonto: number;
  nomePonto: string;
  endereco: string;
  latitude: number;
  longitude: number;
}

export type RotaInfo = Omit<Rota, "pontos">;
