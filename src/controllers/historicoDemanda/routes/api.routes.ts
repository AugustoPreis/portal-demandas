import { Router } from 'express';
import { historicoDemandaController } from '..';
import { isAdmin } from '../../../middlewares/isAdmin';

const apiRoutes = Router({ mergeParams: true });

apiRoutes.get('/', isAdmin, (req, res, next) => {
  historicoDemandaController.listar(req, res, next);
});

apiRoutes.get('/:historicoDemandaId', isAdmin, (req, res, next) => {
  historicoDemandaController.buscarPorId(req, res, next);
});

apiRoutes.post('/', (req, res, next) => {
  historicoDemandaController.cadastrar(req, res, next);
});

export { apiRoutes };