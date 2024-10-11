import { Router } from 'express';
import { isAdmin } from '../../../middlewares/isAdmin';
import { demandaController } from '..';

const apiRoutes = Router();

apiRoutes.get('/', (req, res, next) => {
  demandaController.listar(req, res, next);
});

apiRoutes.get('/:demandaId', (req, res, next) => {
  demandaController.buscarPorId(req, res, next);
});

apiRoutes.post('/', isAdmin, (req, res, next) => {
  demandaController.cadastrar(req, res, next);
});

apiRoutes.put('/:demandaId', isAdmin, (req, res, next) => {
  demandaController.alterar(req, res, next);
});

apiRoutes.put('/:demandaId/inativar', isAdmin, (req, res, next) => {
  demandaController.inativar(req, res, next);
});

export { apiRoutes };