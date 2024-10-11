import { Router } from 'express';
import { apiRoutes } from './api.routes';

const routes = Router();

routes.use(apiRoutes);

export { routes };