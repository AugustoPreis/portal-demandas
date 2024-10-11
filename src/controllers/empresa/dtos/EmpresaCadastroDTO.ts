import { UsuarioCadastroDTO } from '../../usuario/dtos/UsuarioCadastroDTO';

export type EmpresaCadastroDTO = Partial<{
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  usuario: UsuarioCadastroDTO;
}>