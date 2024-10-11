import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { EmpresaCadastroDTO } from './dtos/EmpresaCadastroDTO';
import { EmpresaService } from '../../services/empresaService';
import { EmpresaAlteracaoDTO } from './dtos/EmpresaAlteracaoDTO';

export class EmpresaController {
  constructor(
    private empresaService: EmpresaService,
  ) { }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresaId = Number(req.params.empresaId);

      const result = await this.empresaService.buscarPorId(empresaId);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresa = req.body as EmpresaCadastroDTO;

      const result = await this.empresaService.cadastrar(empresa);

      res.status(HttpStatusCode.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  async alterar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresa = req.body as EmpresaAlteracaoDTO;

      empresa.id = Number(req.params.empresaId);

      const result = await this.empresaService.alterar(empresa, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}