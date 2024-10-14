import { DemandaStatus } from '../../../enums/DemandaStatus';

export type DemandaRetornoDTO = Partial<{
  numero: number;
  titulo: string;
  descricao: string;
  ano: number;
  status: DemandaStatus;
  dataCadastro: Date;
}>