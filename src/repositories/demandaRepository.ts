import { Brackets, QueryRunner } from 'typeorm';
import { DemandaFiltroDTO } from '../controllers/demanda/dtos/DemandaFiltroDTO';
import { Database } from '../database';
import { Demanda } from '../models/Demanda';

export class DemandaRepository {
  private readonly repository = Database.getRepository(Demanda);

  async listar(demandaFiltroDTO: DemandaFiltroDTO): Promise<[Demanda[], number]> {
    return await this.repository
      .createQueryBuilder('dem')
      .where('dem.empresa_id = :empresaId', { empresaId: demandaFiltroDTO.empresaId })
      .andWhere(
        new Brackets((bt) => {
          bt
            .where(`(dem.numero)::varchar ILIKE '%'||:filtro||'%'`)
            .orWhere(`dem.titulo ILIKE '%'||:filtro||'%'`)
        }), { filtro: demandaFiltroDTO.filtro }
      )
      .orderBy('dem.data_cadastro', 'DESC')
      .limit(demandaFiltroDTO.itensPagina)
      .offset((demandaFiltroDTO.pagina - 1) * demandaFiltroDTO.itensPagina)
      .getManyAndCount();
  }

  async buscarPorId(id: number, qr?: QueryRunner): Promise<Demanda> {
    return await this.repository
      .createQueryBuilder('dem', qr)
      .innerJoinAndSelect('dem.empresa', 'empresa')
      .where('dem.id = :id', { id })
      .getOne();
  }

  async buscarProximoNumero(empresaId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('dem')
      .select('MAX(dem.numero)', 'numero')
      .where('dem.empresa_id = :empresaId', { empresaId })
      .andWhere('EXTRACT(YEAR FROM dem.data_cadastro) = EXTRACT(YEAR FROM CURRENT_DATE)')
      .getRawOne();

    return (result?.numero || 0) + 1;
  }

  async salvar(demanda: Demanda, qr?: QueryRunner): Promise<Demanda> {
    if (qr) {
      return await qr.manager.save(demanda);
    }

    return this.repository.save(demanda);
  }
}