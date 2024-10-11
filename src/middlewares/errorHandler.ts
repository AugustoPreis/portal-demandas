import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';
import { RequestError } from '../utils/RequestError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { isValidString } from '../utils/validators';

export function errorHandler(erro: Error, _: Request, res: Response, next: NextFunction) {
  const { code, message } = formatError(erro);

  res.status(code).json({ message });

  next();
}

export function formatError(dirt: unknown): RequestError {
  const error = new RequestError(HttpStatusCode.NOT_FOUND);

  if (dirt instanceof RequestError) {
    return dirt;
  }

  if (dirt instanceof QueryFailedError) {
    return formatTypeormError(dirt);
  }

  if (dirt instanceof Error) {
    error.message = dirt.message;

    return error;
  }

  if (typeof dirt === 'string') {
    error.message = dirt.trim();

    return error;
  }

  try {
    error.message = JSON.stringify(dirt);
  } catch {
    error.code = HttpStatusCode.INTERNAL_SERVER_ERROR;
    error.message = 'Erro desconhecido';
  }

  return error;
}

export function formatTypeormError(queryFailedError: QueryFailedError): RequestError {
  const { message } = queryFailedError;

  const error = new RequestError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Erro ao processar os dados');

  if (!isValidString(message)) {
    return error;
  }

  if (message.includes('violates not-null constraint')) {
    error.code = HttpStatusCode.UNPROCESSABLE_ENTITY;
    error.message = 'Campo obrigatório não informado';
  }

  if (message.includes('violates unique constraint')) {
    error.code = HttpStatusCode.UNPROCESSABLE_ENTITY;
    error.message = 'Registro duplicado';
  }

  if (message.includes('violates foreign key constraint')) {
    error.code = HttpStatusCode.UNPROCESSABLE_ENTITY;
    error.message = 'Registro associado não encontrado';
  }

  if (message.includes('invalid input syntax for type')) {
    error.code = HttpStatusCode.UNPROCESSABLE_ENTITY;
    error.message = 'Tipo inválido';
  }

  if (message.includes('syntax error at or near')) {
    error.code = HttpStatusCode.INTERNAL_SERVER_ERROR;
    error.message = 'Erro de sintaxe';
  }

  return error;
}