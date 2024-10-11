import { Router } from 'express';
import { empresaController } from '..';
import { apiRoutes } from './api.routes';
import { verifyJWT } from '../../../middlewares/auth';

const routes = Router();

routes.post('/empresa', (req, res, next) => {
  empresaController.cadastrar(req, res, next);
});

routes.use('/empresa', verifyJWT, apiRoutes);

export { routes };