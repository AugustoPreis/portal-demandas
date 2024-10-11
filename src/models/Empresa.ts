import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'empresa' })
export class Empresa {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'razao_social' })
  razaoSocial: string;

  @Column({ name: 'nome_fantasia' })
  nomeFantasia: string;

  @Column({ name: 'cnpj', update: false })
  cnpj: string;

  @Column({ name: 'data_cadastro', select: false, update: false })
  dataCadastro: Date;

  @Column({ name: 'ativo', select: false })
  ativo: boolean;

  constructor(id?: number) {
    this.id = id;
  }
}