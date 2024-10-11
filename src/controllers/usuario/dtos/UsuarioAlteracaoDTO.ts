export type UsuarioAlteracaoDTO = Partial<{
  id: number;
  nome: string;
  email: string;
  senha: string;
  admin: boolean;
}>