import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from './Empresa';

@Entity({ name: 'usuario' })
export class Usuario {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'senha' })
  senha: string;

  @Column({ name: 'admin' })
  admin: boolean;

  @Column({ name: 'data_cadastro', select: false, update: false })
  dataCadastro: Date;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'data_inativacao', select: false })
  dataInativacao: Date;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  constructor(id?: number) {
    this.id = id;
  }
}