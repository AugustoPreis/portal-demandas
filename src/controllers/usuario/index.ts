import { UsuarioRepository } from '../../repositories/usuarioRepository';
import { UsuarioService } from '../../services/usuarioService';
import { UsuarioController } from './usuarioController';

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(
  usuarioRepository,
);
const usuarioController = new UsuarioController(
  usuarioService,
);

export {
  usuarioController,
  usuarioService,
  usuarioRepository,
}