import { Router } from 'express';
import { usuarioController } from '..';
import { isAdmin } from '../../../middlewares/isAdmin';

const apiRoutes = Router();

apiRoutes.get('/', (req, res, next) => {
  usuarioController.listar(req, res, next);
});

apiRoutes.get('/:usuarioId', (req, res, next) => {
  usuarioController.buscarPorId(req, res, next);
});

apiRoutes.post('/', isAdmin, (req, res, next) => {
  usuarioController.cadastrar(req, res, next);
});

apiRoutes.put('/:usuarioId', isAdmin, (req, res, next) => {
  usuarioController.alterar(req, res, next);
});

apiRoutes.put('/:usuarioId/inativar', isAdmin, (req, res, next) => {
  usuarioController.inativar(req, res, next);
});

export { apiRoutes };