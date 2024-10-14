import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from './Empresa';

@Entity({ name: 'demanda' })
export class Demanda {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'numero' })
  numero: number;

  @Column({ name: 'titulo' })
  titulo: string;

  @Column({ name: 'descricao' })
  descricao: string;

  @Column({ name: 'data_cadastro', update: false })
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