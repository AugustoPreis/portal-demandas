import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isValidString } from '../utils/validators';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';

export function verifyJWT(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authentication;

  if (!isValidString(token)) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ auth: false, message: 'Sem autentificação.' });

    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded: UsuarioLogadoDTO & { iat: number, exp: number }) => {
    if (err) {
      let message = 'Falha na autentificação';

      if (err.message === 'jwt expired') {
        message = 'Login expirado.';
      }

      return res.status(HttpStatusCode.UNAUTHORIZED).json({ auth: false, message });
    }

    delete decoded.iat;
    delete decoded.exp;

    req.user = decoded;

    next();
  });
}