import { DemandaStatus } from '../../../enums/DemandaStatus';
import { UsuarioRetornoDTO } from '../../usuario/dtos/UsuarioRetornoDTO';

export type HistoricoDemandaRetornoDTO = Partial<{
  id: number;
  observacao: string;
  status: DemandaStatus;
  dataCadastro: Date;
  usuario: UsuarioRetornoDTO;
}>