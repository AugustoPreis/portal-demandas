export type UsuarioCadastroDTO = Partial<{
  nome: string;
  email: string;
  senha: string;
  admin: boolean;
}>