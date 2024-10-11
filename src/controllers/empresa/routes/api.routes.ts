import { Router } from 'express';
import { empresaController } from '..';
import { empresa } from '../../../middlewares/empresa';
import { routes as usuarioRoutes } from '../../usuario/routes/routes';

const apiRoutes = Router();

apiRoutes.use('/:empresaId', empresa);

apiRoutes.get('/:empresaId', (req, res, next) => {
  empresaController.buscarPorId(req, res, next);
});

apiRoutes.put('/:empresaId', (req, res, next) => {
  empresaController.alterar(req, res, next);
});

apiRoutes.use('/:empresaId/usuarios', usuarioRoutes);

export { apiRoutes };