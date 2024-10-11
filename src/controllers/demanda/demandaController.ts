import { NextFunction, Request, Response } from 'express';
import { DemandaService } from '../../services/demandaService';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { DemandaCadastroDTO } from './dtos/DemandaCadastroDTO';
import { DemandaFiltroDTO } from './dtos/DemandaFiltroDTO';
import { DemandaAlteracaoDTO } from './dtos/DemandaAlteracaoDTO';

export class DemandaController {
  constructor(
    private demandaService: DemandaService,
  ) { }

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const demandaFiltroDTO = req.query as DemandaFiltroDTO;

      const result = await this.demandaService.listar(demandaFiltroDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.demandaId);

      const result = await this.demandaService.buscarPorId(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const demanda = req.body as DemandaCadastroDTO;

      const result = await this.demandaService.cadastrar(demanda, req.user);

      res.status(HttpStatusCode.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  async alterar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const demanda = req.body as DemandaAlteracaoDTO;

      demanda.id = Number(req.params.demandaId);

      const result = await this.demandaService.alterar(demanda, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async inativar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.demandaId);

      const result = await this.demandaService.inativar(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}