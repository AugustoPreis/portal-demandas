import { QueryRunner } from 'typeorm';
import { Database } from '../database';
import { Empresa } from '../models/Empresa';

export class EmpresaRepository {
  private readonly repository = Database.getRepository(Empresa);

  async buscarPorId(id: number): Promise<Empresa> {
    return await this.repository
      .createQueryBuilder('emp')
      .where('emp.id = :id', { id })
      .getOne();
  }

  async buscarPorCnpj(cnpj: string): Promise<Empresa> {
    return await this.repository
      .createQueryBuilder('emp')
      .where('emp.cnpj = :cnpj', { cnpj })
      .getOne();
  }

  async salvar(empresa: Empresa, qr?: QueryRunner): Promise<Empresa> {
    if (qr) {
      return await qr.manager.save(empresa);
    }

    return await this.repository.save(empresa);
  }
}