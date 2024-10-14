import { UsuarioRetornoDTO } from '../../usuario/dtos/UsuarioRetornoDTO';

export type HistoricoDemandaRetornoDTO = Partial<{
  id: number;
  observacao: string;
  status: string;
  dataCadastro: Date;
  usuario: UsuarioRetornoDTO;
}>