import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';

export { };

declare global {
  namespace Express {
    export interface Request {
      user?: UsuarioLogadoDTO;
    }
  }
}