import { QueryRunner } from 'typeorm';
import { Database } from '../database';
import { Usuario } from '../models/Usuario';
import { UsuarioFiltroDTO } from '../controllers/usuario/dtos/UsuarioFiltroDTO';

export class UsuarioRepository {
  private readonly repository = Database.getRepository(Usuario);

  async listar(usuarioFiltroDTO: UsuarioFiltroDTO): Promise<[Usuario[], number]> {
    return await this.repository
      .createQueryBuilder('usuario')
      .where('usuario.empresa = :empresa', { empresa: usuarioFiltroDTO.empresa })
      .andWhere('usuario.ativo IS TRUE')
      .andWhere(`usuario.nome ILIKE '%'||:nome||'%'`, { nome: usuarioFiltroDTO.nome })
      .limit(usuarioFiltroDTO.itensPagina)
      .offset((usuarioFiltroDTO.pagina - 1) * usuarioFiltroDTO.itensPagina)
      .orderBy('usuario.nome')
      .getManyAndCount();
  }

  async buscarPorId(id: number): Promise<Usuario> {
    return await this.repository
      .createQueryBuilder('usuario')
      .innerJoinAndSelect('usuario.empresa', 'empresa')
      .where('usuario.id = :id', { id })
      .getOne();
  }

  async buscarPorEmail(email: string, isLogin?: boolean): Promise<Usuario> {
    const qb = this.repository
      .createQueryBuilder('usuario')
      .where('usuario.email = :email', { email });

    if (isLogin) {
      qb
        .addSelect('usuario.senha')
        .innerJoinAndSelect('usuario.empresa', 'empresa');
    }

    return await qb
      .andWhere('usuario.ativo IS TRUE')
      .getOne();
  }

  async salvar(usuario: Usuario, qr?: QueryRunner): Promise<Usuario> {
    if (qr) {
      return qr.manager.save(usuario);
    }

    return this.repository.save(usuario);
  }
}