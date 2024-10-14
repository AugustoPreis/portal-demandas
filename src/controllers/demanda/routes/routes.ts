import { Router } from 'express';
import { apiRoutes } from './api.routes';

const routes = Router({ mergeParams: true });

routes.use(apiRoutes);

export { routes };