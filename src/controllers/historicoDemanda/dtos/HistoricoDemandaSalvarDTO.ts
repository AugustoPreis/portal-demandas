import { DemandaStatus } from '../../../enums/DemandaStatus';

export type HistoricoDemandaSalvarDTO = Partial<{
  demandaId: number;
  observacao: string;
  status: DemandaStatus;
  usuarioDestinoId: number;
}>