import { NextFunction, Request, Response } from 'express';
import { UsuarioService } from '../../services/usuarioService';
import { UsuarioLoginDTO } from './dtos/UsuarioLoginDTO';
import { UsuarioCadastroDTO } from './dtos/UsuarioCadastroDTO';
import { UsuarioAlteracaoDTO } from './dtos/UsuarioAlteracaoDTO';
import { UsuarioFiltroDTO } from './dtos/UsuarioFiltroDTO';

export class UsuarioController {
  constructor(
    private usuarioService: UsuarioService,
  ) { }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuario = req.body as UsuarioLoginDTO;

      const result = await this.usuarioService.login(usuario);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioFiltroDTO = req.query as UsuarioFiltroDTO;

      const result = await this.usuarioService.listar(usuarioFiltroDTO, req.user);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.usuarioId);

      const result = await this.usuarioService.buscarPorId(id, req.user);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuario = req.body as UsuarioCadastroDTO;

      const result = await this.usuarioService.cadastrar(usuario, req.user);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async alterar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuario = req.body as UsuarioAlteracaoDTO;

      usuario.id = Number(req.params.usuarioId);

      const result = await this.usuarioService.alterar(usuario, req.user);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async inativar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.usuarioId);

      const result = await this.usuarioService.inativar(id, req.user);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}