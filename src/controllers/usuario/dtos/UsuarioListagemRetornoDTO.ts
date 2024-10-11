import { UsuarioRetornoDTO } from './UsuarioRetornoDTO';

export type UsuarioListagemRetornoDTO = Partial<{
  data: UsuarioRetornoDTO[];
  total: number;
}>;