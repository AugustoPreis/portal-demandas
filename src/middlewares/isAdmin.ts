import { NextFunction, Request, Response } from 'express';
import { RequestError } from '../utils/RequestError';
import { HttpStatusCode } from '../enums/HttpStatusCode';

export function isAdmin(req: Request, _: Response, next: NextFunction): void {
  if (!req.user.admin) {
    throw new RequestError(HttpStatusCode.FORBIDDEN, 'Conteúdo acessível apenas aos administradores');
  }

  next();
}