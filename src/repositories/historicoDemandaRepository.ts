import { QueryRunner } from 'typeorm';
import { Database } from '../database';
import { HistoricoDemanda } from '../models/HistoricoDemanda';
import { HistoricoDemandaFiltroDTO } from '../controllers/historicoDemanda/dtos/HistoricoDemandaFiltroDTO';

export class HistoricoDemandaRepository {
  private readonly repository = Database.getRepository(HistoricoDemanda);

  async listar(params: HistoricoDemandaFiltroDTO): Promise<[HistoricoDemanda[], number]> {
    return await this.repository
      .createQueryBuilder('hd')
      .innerJoinAndSelect('hd.usuarioDestino', 'usuarioDestino')
      .where('hd.demanda = :demandaId', { demandaId: params.demandaId })
      .limit(params.itensPagina)
      .offset((params.pagina - 1) * params.itensPagina)
      .orderBy('hd.id', 'DESC')
      .getManyAndCount();
  }

  async buscarPorId(id: number): Promise<HistoricoDemanda> {
    return await this.repository
      .createQueryBuilder('hd')
      .innerJoinAndSelect('hd.usuarioDestino', 'usuarioDestino')
      .where('hd.id = :id', { id })
      .getOne();
  }

  async statusAtual(demandaId: number): Promise<HistoricoDemanda> {
    return await this.repository
      .createQueryBuilder('hd')
      .where('hd.demanda = :demandaId', { demandaId })
      .orderBy('hd.id', 'DESC')
      .getOne();
  }

  async salvar(historicoDemanda: HistoricoDemanda, qr?: QueryRunner): Promise<HistoricoDemanda> {
    if (qr) {
      return await qr.manager.save(historicoDemanda);
    }

    return await this.repository.save(historicoDemanda);
  }
}