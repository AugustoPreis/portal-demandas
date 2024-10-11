import { NextFunction, Request, Response } from 'express';
import { RequestError } from '../utils/RequestError';
import { HttpStatusCode } from '../enums/HttpStatusCode';

export async function empresa(req: Request, _: Response, next: NextFunction): Promise<void> {
  try {
    const empresaId = Number(req.params.empresaId);

    if (req.user.empresa?.id != empresaId) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Você não tem permissão para acessar essa empresa');
    }

    next();
  } catch (err) {
    next(err);
  }
}