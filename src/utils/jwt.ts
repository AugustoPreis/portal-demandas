import jwt from 'jsonwebtoken';
import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';
import { addDays } from 'date-fns';

export function sign(values: UsuarioLogadoDTO) {
  const secret = process.env.JWT_SECRET;
  const daysExpire = Number(process.env.JWT_DAYS_EXPIRE);
  const expiresIn = addDays(new Date(), daysExpire);

  const token = jwt.sign(values, secret, {
    expiresIn: expiresIn.getTime(),
  });

  return { token, expiresIn };
}