import { Router } from 'express';
import { usuarioController } from '../controllers/usuario';
import { routes as empresaRoutes } from '../controllers/empresa/routes/routes';

const routes = Router({ mergeParams: true });

routes.put('/login', (req, res, next) => {
  usuarioController.login(req, res, next);
});

routes.use(empresaRoutes);

export { routes };