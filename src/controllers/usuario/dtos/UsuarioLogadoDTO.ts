import { EmpresaRetornoDTO } from '../../empresa/dtos/EmpresaRetornoDTO';

export type UsuarioLogadoDTO = Partial<{
  id: number;
  nome: string;
  admin: boolean;
  empresa: EmpresaRetornoDTO;
}>