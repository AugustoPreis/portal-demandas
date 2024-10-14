import { NextFunction } from 'express-serve-static-core';
import { HistoricoDemandaService } from '../../services/historicoDemandaService';
import { Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { HistoricoDemandaSalvarDTO } from './dtos/HistoricoDemandaSalvarDTO';
import { HistoricoDemandaFiltroDTO } from './dtos/HistoricoDemandaFiltroDTO';

export class HistoricoDemandaController {
  constructor(
    private historicoDemandaService: HistoricoDemandaService,
  ) { }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const historicoDemandaId = Number(req.params.historicoDemandaId);

      const result = await this.historicoDemandaService.buscarPorId(historicoDemandaId);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async statusAtual(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const demandaId = Number(req.params.demandaId);

      const result = await this.historicoDemandaService.statusAtual(demandaId);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const historicoDemandaFiltroDTO = req.query as HistoricoDemandaFiltroDTO;

      historicoDemandaFiltroDTO.demandaId = Number(req.params.demandaId);

      const result = await this.historicoDemandaService.listar(historicoDemandaFiltroDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const historicoDemanda = req.body as HistoricoDemandaSalvarDTO;

      historicoDemanda.demandaId = Number(req.params.demandaId);

      const result = await this.historicoDemandaService.cadastrar(historicoDemanda, req.user);

      res.status(HttpStatusCode.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }
}